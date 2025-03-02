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
    }
}
