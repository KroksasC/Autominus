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
                UserName = "testuser",
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
            var result = await controller.GetUser("aaa");

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));  // Should return 404
        }

        [TestMethod]
        public async Task GetUser_ShouldNotReturnNull_WhenUserExists()
        {
            // Arrange

            var context = GetDbContext();
            // Seed the database with a test user
            var controller = new UserController(context);

            // Act
            var result = await controller.GetUsers();
            var okResult = result.Result as OkObjectResult;
            var user = okResult?.Value as User;

            // Assert
            Assert.IsNotNull(result);
        }
    }
    [TestClass]
    public sealed class CarControllerTests
    {
        private ModelsContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ModelsContext(options);

            context.Cars.Add(new Car
            {
                Id = 1,
                Brand = "1",
                Model = "1"

            });
            context.SaveChanges();

            return context;
        }

        [TestMethod]
        public async Task GetCar_ShouldReturnNull_WhenCarDoesntExist()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new CarController(context);

            // Act
            var result = await controller.GetCar(999);
            var okResult = result.Result as OkObjectResult;
            var car = okResult?.Value as Car;

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task GetCar_ShouldReturnCar_WhenCarExists()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetCar(1);
            var okResult = result.Result as OkObjectResult;

            Assert.IsNotNull(result.Value);
            Assert.AreEqual("1", result.Value.Brand);
            Assert.AreEqual("1", result.Value.Model);
        }
    }
}