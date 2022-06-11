using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            this._context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrieveBasket(GetBuyerId());

            if (basket == null)
            {
                return NotFound();
            }
            return basket.MapToDto();
        }

        [HttpPost]
        public async Task<ActionResult> AddItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null)
            {
                basket = CreateBasket();
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return BadRequest(new ProblemDetails { Title = "Product Not Found" });
            }

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return CreatedAtRoute("GetBasket", basket.MapToDto());
            }
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null)
            {
                return NotFound();
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound();
            }

            basket.RemoveItem(product.Id, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return Ok();
            }

            return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
        }

        private async Task<Basket> RetrieveBasket(string buyerID)
        {
            if (string.IsNullOrWhiteSpace(buyerID))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerID);
        }

        private Basket CreateBasket()
        {
            string buyerId = User.Identity?.Name;
            if (string.IsNullOrWhiteSpace(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }

        private string GetBuyerId()
        {
            return User.Identity.Name ?? Request.Cookies["buyerID"];
        }
    }
}