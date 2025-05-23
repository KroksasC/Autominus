﻿using Autominus.Server.Data;
using Autominus.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autominus.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ModelsContext _context;

        public UserController(ModelsContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var User = await _context.Users.FindAsync(id);

            if (User == null)
            {
                return NotFound();
            }

            return User;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest();
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }
            existingUser.UserName = updatedUser.UserName;
            existingUser.Email = updatedUser.Email;
            existingUser.PhoneNumber = updatedUser.PhoneNumber;
            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;
            existingUser.City = updatedUser.City;
            existingUser.Street = updatedUser.Street;
            existingUser.Address = updatedUser.Address;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExist(id))
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("favorite/{userId}/{carId}")]
        public async Task<bool> IsCarFavoriteByUser(string userId, int carId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null || user.FavoriteCars == null)
            {
                return false;
            }

            return user.FavoriteCars.Contains(carId);
        }

        [HttpPut("favorite/add/{userId}/{carId}")]
        public async Task<IActionResult> AddCarToFavorites(string userId, int carId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            user.FavoriteCars ??= new List<int>(); // Initialize if null

            if (!user.FavoriteCars.Contains(carId))
            {
                user.FavoriteCars.Add(carId);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpPut("favorite/remove/{userId}/{carId}")]
        public async Task<IActionResult> RemoveCarFromFavorites(string userId, int carId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null || user.FavoriteCars == null)
            {
                return NotFound();
            }

            if (user.FavoriteCars.Contains(carId))
            {
                user.FavoriteCars.Remove(carId);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        private bool UserExist(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
