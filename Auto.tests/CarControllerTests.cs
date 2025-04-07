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

        // Tests the GetCar method, which returns a specified car. The expected result is for no car to be returned.
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

        // Tests the GetCar method, which returns a specified car. The expected result is for a car to be returned.
        [TestMethod]
        public async Task GetCar_ShouldReturnCar_WhenCarExists()
        {
            //Arrange
            var context = GetDbContext();
            var controller = new CarController(context);

            //Act
            var result = await controller.GetCar(1);

            //Assert
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
        private TestContext testContextInstance;
        public TestContext TestContext
        {
            get { return testContextInstance; }
            set { testContextInstance = value; }
        }

        // Tests the GetCars method, which returns every car that is added. The expected result is for every car to be returned.
        [TestMethod]
        public async Task GetCars_ShouldReturnCars_WhenCarsExists()
        {
            //Arrange
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
            context.Cars.Add(new Car
            {
                Id = 2,
                Brand = "2",
                Model = "2"
            });
            context.SaveChanges();
            var controller = new CarController(context);

            //Act
            var result = await controller.GetCars();
            var cars = result.Value as IEnumerable<Car>;

            //Assert
            Assert.IsNotNull(cars);
            var carList = cars.ToList();
            var firstCar = carList.FirstOrDefault(c => c.Id == 1);
            Assert.IsNotNull(firstCar);
            Assert.AreEqual("1", firstCar.Brand);
            Assert.AreEqual("1", firstCar.Model);
            var secondCar = carList.FirstOrDefault(c => c.Id == 2);
            Assert.IsNotNull(secondCar);
            Assert.AreEqual("2", secondCar.Brand);
            Assert.AreEqual("2", secondCar.Model);
        }

        // Tests the GetCars method, which returns every car that is added. The expected result is for no car to be returned.
        [TestMethod]
        public async Task GetCars_ShouldReturnNoCars_WhenCarsDontExists()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ModelsContext(options);
            context.SaveChanges();
            var controller = new CarController(context);

            //Act
            var result = await controller.GetCars();
            var cars = result.Value as IEnumerable<Car>;

            //Assert
            Assert.IsNotNull(cars);
            var carList = cars.ToList();
            var firstCar = carList.FirstOrDefault(c => c.Id == 1);
            Assert.IsNull(firstCar);
        }

        // Tests the PutCar method, which puts a car in a specified place. The expected result is for a car to be added in a place.
        [TestMethod]
        public async Task PutCar_ShouldPutCar()
        {
            //Arrange
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
            var controller = new CarController(context);

            //Act
            Car test_car = new Car
            {
                Id = 1,
                Brand = "3",
                Model = "3"
            };
            await controller.PutCar(1, test_car);
            var result = await controller.GetCar(1);

            //Assert
            Assert.IsNotNull(result.Value);
            Assert.AreEqual("3", result.Value.Brand);
            Assert.AreEqual("3", result.Value.Model);
        }

        // Tests the PostCar method, which posts a car. The expected result is for a car to be added.
        [TestMethod]
        public async Task PostCar_ShouldPostCar()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ModelsContext(options);
            context.SaveChanges();
            var controller = new CarController(context);

            //Act
            User test_user = new User
            {
                UserName = "testuser",
                Email = "test@example.com",
                Id = "1"
            };
            Car test_car = new Car
            {
                Id = 1,
                Brand = "1",
                Model = "1",
                User = test_user
            };
            context.Users.Add(test_user);
            await controller.PostCar(test_car);
            var result = await controller.GetCar(1);

            //Assert
            Assert.IsNotNull(result.Value);
            Assert.AreEqual("1", result.Value.Brand);
            Assert.AreEqual("1", result.Value.Model);
        }

        // Tests the DeleteCar method, which deletes a car by id. The expected result is for a car to be deleted.
        [TestMethod]
        public async Task DeleteCar_ShouldDeleteCar()
        {
            //Arrange
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
            var controller = new CarController(context);

            //Act
            await controller.DeleteCar(1);
            var result = await controller.GetCar(1);

            //Assert
            Assert.IsNull(result.Value);
        }

        // Tests the DeleteCar method, which deletes a car by id. The expected result is for no car to be found.
        [TestMethod]
        public async Task DeleteCar_ShouldReturnNotFound_WhenCardDoesntExist()
        {
            //Arrange
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
            var controller = new CarController(context);

            //Act
            var result = await controller.DeleteCar(2);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }
    }
}