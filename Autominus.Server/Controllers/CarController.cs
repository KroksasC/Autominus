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

        public CarController(ModelsContext context)
        {
            _context = context;
        }

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

            var existingCar = await _context.Cars.FindAsync(id);
            if (existingCar != null)
            {
                _context.Entry(existingCar).State = EntityState.Detached;
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

        [HttpGet("ordered-by-year")]
        public async Task<ActionResult<IEnumerable<Car>>> GetCarsOrderedByYear([FromQuery] bool desc = false)
        {
            var cars = desc
                ? _context.Cars.OrderByDescending(c => c.Year)
                : _context.Cars.OrderBy(c => c.Year);

            return await cars.Include(c => c.User).ToListAsync();
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
            [FromQuery] string brand,
            [FromQuery] string model,
            [FromQuery] int? year,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            var query = _context.Cars.AsQueryable();

            if (!string.IsNullOrEmpty(brand))
                query = query.Where(c => c.Brand.Contains(brand));

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
    }
}
