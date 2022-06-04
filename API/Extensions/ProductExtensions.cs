using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        // Here concept of extension is being applied to IQueryable<Product>
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderByArgument)
        {
            if (string.IsNullOrWhiteSpace(orderByArgument))
            {
                return query.OrderBy(p => p.Name);
            }

            query = orderByArgument switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return query;
            }

            string lowersearchTerm = searchTerm.ToLower();
            return query.Where(p => p.Name.ToLower().Contains(lowersearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            if (!string.IsNullOrWhiteSpace(brands))
            {
                brandList = brands.Trim().ToLower().Split(",").ToList();
            }

            if (!string.IsNullOrWhiteSpace(types))
            {
                typeList = types.Trim().ToLower().Split(",").ToList();
            }

            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

            return query;
        }
    }
}