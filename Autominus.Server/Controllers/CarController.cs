using Autominus.Server.Data;
using Autominus.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autominus.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly ModelsContext _context;

        public CarController(ModelsContext context) => _context = context;
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        {
            return await _context.Cars.Include(c => c.User).ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var Car = await _context.Cars.FindAsync(id);

            if (Car == null)
            {
                return NotFound();
            }

            return Car;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCar(int id, Car Car)
        {
            if (id != Car.Id)
            {
                return BadRequest();
            }

            _context.Cars.Entry(Car).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExist(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }
        [HttpPost]
        public async Task<ActionResult<Car>> PostCar(Car Car)
        {
            var user = await _context.Users.FindAsync(Car.User.Id);

            if (user == null)
            {
                return NotFound();
            }

            Car.User = user;

            _context.Cars.Add(Car);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostCar), new { id = Car.Id }, Car);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var todo = await _context.Cars.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(todo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool CarExist(int id)
        {
            return _context.Cars.Any(e => e.Id == id);
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetCarCount()
        {
            return await _context.Cars.CountAsync();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Car>>> SearchCars([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query cannot be empty.");

            var results = await _context.Cars
                .Where(c => c.Brand.Contains(query) || c.Model.Contains(query))
                .Include(c => c.User)
                .ToListAsync();

            return results;
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IEnumerable<string>>> GetDistinctBrands()
        {
            return await _context.Cars
                .Select(c => c.Brand)
                .Distinct()
                .ToListAsync();
        }

        [HttpGet("ordered-by-year")]
        public async Task<ActionResult<IEnumerable<Car>>> GetCarsOrderedByYear([FromQuery] bool desc = false)
        {
            var cars = desc
                ? _context.Cars.OrderByDescending(c => c.Year)
                : _context.Cars.OrderBy(c => c.Year);

            return await cars.Include(c => c.User).ToListAsync();
        }

        [HttpGet("stats/make-counts")]
        public async Task<ActionResult<IEnumerable<object>>> GetCarBrandCounts()
        {
            var stats = await _context.Cars
                .GroupBy(c => c.Brand)
                .Select(g => new { Make = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(stats);
        }

        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<Car>>> GetRecentCars([FromQuery] int days = 7)
        {
            var cutoff = DateTime.UtcNow.AddDays(-days);
            return await _context.Cars
                .Where(c => c.CreatedAt >= cutoff)
                .Include(c => c.User)
                .ToListAsync();
        }

        [HttpGet("search-advanced")]
        public async Task<ActionResult<IEnumerable<Car>>> AdvancedSearchCars(
            [FromQuery] string make,
            [FromQuery] string model,
            [FromQuery] int? year,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            var query = _context.Cars.AsQueryable();

            if (!string.IsNullOrEmpty(make))
                query = query.Where(c => c.Brand.Contains(make));

            if (!string.IsNullOrEmpty(model))
                query = query.Where(c => c.Model.Contains(model));

            if (year.HasValue)
                query = query.Where(c => c.Year == year.Value);

            if (minPrice.HasValue)
                query = query.Where(c => c.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(c => c.Price <= maxPrice.Value);

            var result = await query.Include(c => c.User).ToListAsync();
            return Ok(result);
        }

        [HttpGet("price-range")]
        public async Task<ActionResult<object>> GetPriceRange()
        {
            var minPrice = await _context.Cars.MinAsync(c => c.Price);
            var maxPrice = await _context.Cars.MaxAsync(c => c.Price);
            var avgPrice = await _context.Cars.AverageAsync(c => c.Price);

            return new { MinPrice = minPrice, MaxPrice = maxPrice, AveragePrice = avgPrice };
        }

        [HttpGet("year-range")]
        public async Task<ActionResult<object>> GetYearRange()
        {
            var minYear = await _context.Cars.MinAsync(c => c.Year);
            var maxYear = await _context.Cars.MaxAsync(c => c.Year);

            return new { OldestYear = minYear, NewestYear = maxYear };
        }

        [HttpGet("random")]
        public async Task<ActionResult<Car>> GetRandomCar()
        {
            var count = await _context.Cars.CountAsync();
            if (count == 0)
            {
                return NotFound();
            }

            var random = new Random();
            var skip = random.Next(0, count);

            var randomCar = await _context.Cars
                .Include(c => c.User)
                .Skip(skip)
                .FirstOrDefaultAsync();

            return randomCar;
        }

        [HttpGet("most-expensive")]
        public async Task<ActionResult<IEnumerable<Car>>> GetMostExpensiveCars([FromQuery] int count = 5)
        {
            return await _context.Cars
                .OrderByDescending(c => c.Price)
                .Take(count)
                .Include(c => c.User)
                .ToListAsync();
        }

        [HttpGet("by-year/{year}")]
        public async Task<ActionResult<IEnumerable<Car>>> GetCarsByYear(int year)
        {
            return await _context.Cars
                .Where(c => c.Year == year)
                .Include(c => c.User)
                .ToListAsync();
        }

        [HttpGet("price-stats-by-brand")]
        public async Task<ActionResult<IEnumerable<object>>> GetPriceStatsByBrand()
        {
            var stats = await _context.Cars
                .GroupBy(c => c.Brand)
                .Select(g => new
                {
                    Brand = g.Key,
                    Count = g.Count(),
                    AveragePrice = g.Average(c => c.Price),
                    MinPrice = g.Min(c => c.Price),
                    MaxPrice = g.Max(c => c.Price)
                })
                .ToListAsync();

            return Ok(stats);
        }

        [HttpPatch("{id}/price")]
        public async Task<IActionResult> UpdateCarPrice(int id, [FromBody] decimal newPrice)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            car.Price = newPrice;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("similar/{id}")]
        public async Task<ActionResult<IEnumerable<Car>>> GetSimilarCars(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            return await _context.Cars
                .Where(c => c.Id != id &&
                           (c.Brand == car.Brand ||
                            c.Model == car.Model ||
                            c.Year == car.Year))
                .Include(c => c.User)
                .Take(5)
                .ToListAsync();
        }

        [HttpGet("count-by-year")]
        public async Task<ActionResult<IEnumerable<object>>> GetCountByYear()
        {
            var stats = await _context.Cars
                .GroupBy(c => c.Year)
                .Select(g => new { Year = g.Key, Count = g.Count() })
                .OrderBy(x => x.Year)
                .ToListAsync();

            return Ok(stats);
        }

    }
}
