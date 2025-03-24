﻿using System.Threading.Tasks;
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
                .UseInMemoryDatabase(databaseName: "TestDb")
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

        private ModelsContext GetDbCarContext()
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;

            var context = new ModelsContext(options);

            // Seed the database with a test car
            context.Cars.Add(new Car
            {
                Id = 1,
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
        public async Task GetCar_ShouldNotReturnNull_WhenCarExists()
        {
            // Arrange
            var context = GetDbCarContext();
            var controller = new CarController(context);

            // Act
            var result = await controller.GetCar(1);
            var okResult = result.Result as OkObjectResult;
            var car = okResult?.Value as Car;


            // Assert
            Assert.IsNotNull(result.Value);
        }
    }
}