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
                Brand = "Toyota",
                Model = "Corolla",
                Year = 2020,
                Price = 20000,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            });

            context.Cars.Add(new Car
            {
                Id = 2,
                Brand = "Toyota",
                Model = "Camry",
                Year = 2021,
                Price = 25000,
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            });

            context.Cars.Add(new Car
            {
                Id = 3,
                Brand = "Honda",
                Model = "Civic",
                Year = 2019,
                Price = 18000,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
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

            Assert.IsNotNull(result.Value);
            Assert.AreEqual("Toyota", result.Value.Brand);
            Assert.AreEqual("Corolla", result.Value.Model);
        }

        [TestMethod]
        public async Task GetCarCount_ShouldReturnCorrectCount()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetCarCount();

            Assert.AreEqual(3, result.Value);
        }

        [TestMethod]
        public async Task SearchCars_ShouldReturnBadRequest_WhenQueryEmpty()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.SearchCars("");

            Assert.IsInstanceOfType(result.Result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public async Task GetCarsOrderedByYear_ShouldReturnAscendingByDefault()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetCarsOrderedByYear();
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(2019, cars?.First().Year);
            Assert.AreEqual(2021, cars?.Last().Year);
        }

        [TestMethod]
        public async Task GetCarsOrderedByYear_ShouldReturnDescending_WhenRequested()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetCarsOrderedByYear(true);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(2021, cars?.First().Year);
            Assert.AreEqual(2019, cars?.Last().Year);
        }

        [TestMethod]
        public async Task GetRecentCars_ShouldReturnRecentCarsOnly()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetRecentCars(5); // last 5 days
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(2, cars?.Count());
        }

        [TestMethod]
        public async Task AdvancedSearchCars_ShouldFilterByMultipleParameters()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.AdvancedSearchCars(brand: "Toyota", model: "Camry", year: 2021, minPrice: null, maxPrice: null);
            var okResult = result.Result as OkObjectResult;
            var cars = okResult?.Value as List<Car>;

            Assert.AreEqual(1, cars?.Count);
            Assert.AreEqual("Camry", cars?[0].Model);
        }

        [TestMethod]
        public async Task GetRandomCar_ShouldReturnValidCar()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetRandomCar();

            Assert.IsNotNull(result.Value);
        }

        [TestMethod]
        public async Task GetMostExpensiveCars_ShouldReturnTopPricedCars()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetMostExpensiveCars(2);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(2, cars?.Count());
            Assert.AreEqual(25000, cars?.First().Price);
        }

        [TestMethod]
        public async Task GetCarsByYear_ShouldFilterCorrectly()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetCarsByYear(2020);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(1, cars?.Count());
            Assert.AreEqual("Corolla", cars?.First().Model);
        }

        [TestMethod]
        public async Task UpdateCarPrice_ShouldUpdatePrice()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var newPrice = 30000m;
            var result = await controller.UpdateCarPrice(1, newPrice);

            Assert.IsInstanceOfType(result, typeof(NoContentResult));

            var updatedCar = await context.Cars.FindAsync(1);
            Assert.AreEqual(newPrice, updatedCar?.Price);
        }

        [TestMethod]
        public async Task GetSimilarCars_ShouldReturnRelatedCars()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetSimilarCars(1);
            var cars = result.Value as IEnumerable<Car>;

            Assert.IsTrue(cars?.Any());
            Assert.IsFalse(cars?.Any(c => c.Id == 1));
        }

        [TestMethod]
        public async Task AdvancedSearchCars_ShouldReturnAllCars_WhenNoFiltersApplied()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.AdvancedSearchCars(null, null, null, null, null);
            var okResult = result.Result as OkObjectResult;
            var cars = okResult?.Value as List<Car>;

            Assert.AreEqual(3, cars?.Count);
        }

        [TestMethod]
        public async Task GetRandomCar_ShouldReturnNotFound_WhenNoCarsExist()
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var emptyContext = new ModelsContext(options);

            var controller = new CarController(emptyContext);
            var result = await controller.GetRandomCar();

            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task GetMostExpensiveCars_ShouldReturnLimitedResults_WhenCountSpecified()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetMostExpensiveCars(1);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(1, cars?.Count());
        }

        [TestMethod]
        public async Task GetCarsByYear_ShouldReturnEmptyList_WhenNoCarsForYearExist()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetCarsByYear(1990);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(0, cars?.Count());
        }

        [TestMethod]
        public async Task UpdateCarPrice_ShouldReturnNotFound_WhenCarDoesntExist()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.UpdateCarPrice(999, 30000m);

            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task GetSimilarCars_ShouldReturnEmptyList_WhenNoSimilarCarsExist()
        {
            // Add a unique car that has no similar models
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var uniqueContext = new ModelsContext(options);
            uniqueContext.Cars.Add(new Car
            {
                Id = 1,
                Brand = "UniqueBrand",
                Model = "UniqueModel",
                Year = 1990
            });
            uniqueContext.SaveChanges();

            var controller = new CarController(uniqueContext);
            var result = await controller.GetSimilarCars(1);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(0, cars?.Count());
        }

        [TestMethod]
        public async Task AdvancedSearchCars_ShouldHandlePriceRangeCorrectly()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.AdvancedSearchCars(null, null, null, 19000, 21000);
            var okResult = result.Result as OkObjectResult;
            var cars = okResult?.Value as List<Car>;

            Assert.AreEqual(1, cars?.Count);
            Assert.AreEqual("Corolla", cars?[0].Model);
        }

        [TestMethod]
        public async Task GetRecentCars_ShouldHandleZeroDaysParameter()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetRecentCars(0);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(0, cars?.Count());
        }

        [TestMethod]
        public async Task GetMostExpensiveCars_ShouldReturnAll_WhenCountExceedsTotal()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetMostExpensiveCars(10);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(3, cars?.Count());
        }

        [TestMethod]
        public async Task GetCarsByYear_ShouldHandleFutureYear()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetCarsByYear(2050);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(0, cars?.Count());
        }

        [TestMethod]
        public async Task GetSimilarCars_ShouldPrioritizeSameBrand()
        {
            // Add more test data
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var context = new ModelsContext(options);

            context.Cars.Add(new Car { Id = 1, Brand = "Toyota", Model = "A", Year = 2020 });
            context.Cars.Add(new Car { Id = 2, Brand = "Toyota", Model = "B", Year = 2019 });
            context.Cars.Add(new Car { Id = 3, Brand = "Honda", Model = "A", Year = 2020 });
            context.SaveChanges();

            var controller = new CarController(context);
            var result = await controller.GetSimilarCars(1);
            var cars = result.Value as IEnumerable<Car>;

            // Should prefer Toyota models first
            Assert.AreEqual("Toyota", cars?.First().Brand);
        }

        [TestMethod]
        public async Task GetCarCount_ShouldReturnZero_AfterDeletingAllCars()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            // Delete all cars
            foreach (var car in context.Cars)
            {
                context.Cars.Remove(car);
            }
            context.SaveChanges();

            var result = await controller.GetCarCount();

            Assert.AreEqual(0, result.Value);
        }

        [TestMethod]
        public async Task AdvancedSearchCars_ShouldHandleOnlyMinPrice()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.AdvancedSearchCars(null, null, null, 22000, null);
            var okResult = result.Result as OkObjectResult;
            var cars = okResult?.Value as List<Car>;

            Assert.AreEqual(1, cars?.Count);
            Assert.AreEqual("Camry", cars?[0].Model);
        }

        [TestMethod]
        public async Task AdvancedSearchCars_ShouldHandleOnlyMaxPrice()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.AdvancedSearchCars(null, null, null, null, 19000);
            var okResult = result.Result as OkObjectResult;
            var cars = okResult?.Value as List<Car>;

            Assert.AreEqual(1, cars?.Count);
            Assert.AreEqual("Civic", cars?[0].Model);
        }

        [TestMethod]
        public async Task GetRandomCar_ShouldReturnDifferentCars_OnMultipleCalls()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var results = new List<int>();
            for (int i = 0; i < 10; i++)
            {
                var result = await controller.GetRandomCar();
                results.Add(result.Value.Id);
            }

            // Verify we got at least 2 different cars in 10 attempts
            Assert.IsTrue(results.Distinct().Count() > 1);
        }

        [TestMethod]
        public async Task GetMostExpensiveCars_ShouldReturnInCorrectOrder()
        {
            var context = GetDbContext();
            var controller = new CarController(context);

            var result = await controller.GetMostExpensiveCars(3);
            var cars = result.Value as List<Car>;

            Assert.IsTrue(cars?[0].Price >= cars?[1].Price);
            Assert.IsTrue(cars?[1].Price >= cars?[2].Price);
        }

        [TestMethod]
        public async Task GetCarsByYear_ShouldHandleMultipleCarsSameYear()
        {
            // Add test data with multiple cars from same year
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var context = new ModelsContext(options);

            context.Cars.Add(new Car { Id = 1, Brand = "A", Model = "A", Year = 2020 });
            context.Cars.Add(new Car { Id = 2, Brand = "B", Model = "B", Year = 2020 });
            context.SaveChanges();

            var controller = new CarController(context);
            var result = await controller.GetCarsByYear(2020);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(2, cars?.Count());
        }

        [TestMethod]
        public async Task GetSimilarCars_ShouldLimitResultsToFive()
        {
            // Add test data with many similar cars
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var context = new ModelsContext(options);

            for (int i = 1; i <= 10; i++)
            {
                context.Cars.Add(new Car { Id = i, Brand = "Toyota", Model = $"Model{i}", Year = 2020 });
            }
            context.SaveChanges();

            var controller = new CarController(context);
            var result = await controller.GetSimilarCars(1);
            var cars = result.Value as IEnumerable<Car>;

            Assert.AreEqual(5, cars?.Count());
        }
    }
}