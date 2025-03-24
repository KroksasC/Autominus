using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Autominus.Server.Controllers;
using Autominus.Server.Models;
using Autominus.Server.Data;

namespace Auto.Tests
{
    [TestClass]
    public sealed class UserControllerTests
    {
        private ModelsContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) 
                .Options;

            var context = new ModelsContext(options);

            // Seed the database with a test user
            context.Users.Add(new User
            {
                Id = 1,
                Username = "testuser",
                Email = "test@example.com"
            });
            context.SaveChanges();

            return context;
        }

        [TestMethod]
        public async Task GetUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new UserController(context);

            // Act
            var result = await controller.GetUser(999);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));  // Should return 404
        }

        [TestMethod]
        public async Task GetUser_ShouldNotReturnNull_WhenUserExists()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new UserController(context);

            // Act
            var result = await controller.GetUser(1);
            var okResult = result.Result as OkObjectResult;
            var user = okResult?.Value as User;

            // Assert
            Assert.IsNotNull(result);
        }
    }
}