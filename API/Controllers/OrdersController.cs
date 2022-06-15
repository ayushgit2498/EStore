using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
               .ProjectOrderToOrderDto()
               .Where(x => x.BuyerId == User.Identity.Name)
               .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null)
            {
                return BadRequest(new ProblemDetails { Title = "Could not locate basket" });
            }

            var orderItems = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                var productItemOrdered = new ProductItemOrdered
                {
                    ProductId = product.Id,
                    Name = product.Name,
                    PictureUrl = product.PictureUrl
                };
                var orderItem = new OrderItem
                {
                    ItemOrdered = productItemOrdered,
                    Price = product.Price,
                    Quantity = item.Quantity
                };

                orderItems.Add(orderItem);
                product.QuantityInStock -= item.Quantity;
            }

            var subTotal = orderItems.Sum(item => item.Quantity * item.Price);
            var deliveryFee = subTotal > 10000 ? 0 : 500;

            var order = new Order
            {
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                OrderItems = orderItems,
                SubTotal = subTotal,
                DeliveryFee = deliveryFee,
                OrderStatus = OrderStatus.Created
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _context.Users
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                var address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country
                };
                user.Address = address;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                // Here we can use Order.Id because order is now stored in DB.
                return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
            }

            return BadRequest(new ProblemDetails { Title = "Problem Creating Order" });
        }
    }
}