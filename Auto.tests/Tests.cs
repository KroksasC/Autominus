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
            var okResult = result.Result as OkObjectResult;

            //Assert
            Assert.IsNotNull(result.Value);
            Assert.AreEqual("1", result.Value.Brand);
            Assert.AreEqual("1", result.Value.Model);
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