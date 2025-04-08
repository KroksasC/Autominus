using Autominus.Server.Controllers;
using Autominus.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Auto.tests
{
    /// <summary>
    /// Integration tests for UserController endpoints using in-memory database. Testing how (controller + EF Core + data layer) works together.
    /// </summary>
    [TestClass]
    public sealed class UserControllerTests
    {
        /// <summary>
        /// Creates a new in-memory database context and seeds it with a test user.
        /// </summary>
        private ModelsContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ModelsContext(options);
            context.Users.Add(new User
            {
                UserName = "testuser",
                Email = "test@example.com"
            });
            context.SaveChanges();
            return context;
        }

        /// <summary>
        /// Verifies that GetUser returns 404 NotFound when user is not in the database.
        /// </summary>
        [TestMethod]
        public async Task GetUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            var context = GetDbContext();
            var controller = new UserController(context);

            var result = await controller.GetUser("aaa");

            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        /// <summary>
        /// Verifies that GetUsers returns a result when users exist in the database.
        /// </summary>
        [TestMethod]
        public async Task GetUser_ShouldNotReturnNull_WhenUserExists()
        {
            var context = GetDbContext();
            var controller = new UserController(context);

            var result = await controller.GetUsers();

            Assert.IsNotNull(result);
        }

        /// <summary>
        /// Tests that DeleteUser returns NoContent (204) when deleting an existing user.
        /// </summary>
        [TestMethod]
        public async Task DeleteUser_ShouldReturnNoContent_WhenUserExists()
        {
            var context = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            using var dbContext = new ModelsContext(context);
            dbContext.Users.Add(new User
            {
                Id = "user123",
                UserName = "deletableUser",
                Email = "delete@example.com"
            });
            dbContext.SaveChanges();

            var controller = new UserController(dbContext);
            var result = await controller.DeleteUser("user123");

            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        /// <summary>
        /// Tests that DeleteUser returns NotFound when the user ID does not exist.
        /// </summary>
        [TestMethod]
        public async Task DeleteUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            var context = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            using var dbContext = new ModelsContext(context);
            var controller = new UserController(dbContext);
            var result = await controller.DeleteUser("nonexistent");

            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        /// <summary>
        /// Tests that PutUser successfully updates an existing user and returns NoContent.
        /// </summary>
        [TestMethod]
        public async Task PutUser_ShouldReturnNoContent_WhenUserIsUpdatedSuccessfully()
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            using var dbContext = new ModelsContext(options);
            dbContext.Users.Add(new User
            {
                Id = "user123",
                UserName = "olduser",
                Email = "old@example.com"
            });
            dbContext.SaveChanges();

            var controller = new UserController(dbContext);

            var updatedUser = new User
            {
                Id = "user123",
                UserName = "newuser",
                Email = "new@example.com"
            };

            var result = await controller.PutUser("user123", updatedUser);

            Assert.IsInstanceOfType(result, typeof(NoContentResult));

            var userInDb = await dbContext.Users.FindAsync("user123");
            Assert.AreEqual("newuser", userInDb?.UserName);
            Assert.AreEqual("new@example.com", userInDb?.Email);
        }

        /// <summary>
        /// Tests that PutUser returns BadRequest when the ID in the route and model do not match.
        /// </summary>
        [TestMethod]
        public async Task PutUser_ShouldReturnBadRequest_WhenIdsDoNotMatch()
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            using var dbContext = new ModelsContext(options);
            var controller = new UserController(dbContext);

            var user = new User
            {
                Id = "differentId",
                UserName = "user",
                Email = "email@example.com"
            };

            var result = await controller.PutUser("urlId", user);

            Assert.IsInstanceOfType(result, typeof(BadRequestResult));
        }

        [TestMethod]
        public async Task DeleteUser_ShouldCallSaveChanges_WhenUserExists()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            using var dbContext = new ModelsContext(options);
            var testUser = new User
            {
                Id = "user123",
                UserName = "deletableUser",
                Email = "delete@example.com"
            };
            dbContext.Users.Add(testUser);
            await dbContext.SaveChangesAsync();

            var saveChangesCalled = false;
            var mockContext = new Mock<ModelsContext>(options) { CallBase = true };
            mockContext.Setup(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Callback(() => saveChangesCalled = true)
                .ReturnsAsync(1);

            mockContext.Setup(m => m.Users).Returns(dbContext.Users);
            mockContext.Setup(m => m.FindAsync<User>(It.IsAny<object[]>()))
                .ReturnsAsync((object[] ids) => ids[0].ToString() == "user123" ? testUser : null);

            var controller = new UserController(mockContext.Object);

            // Act
            var result = await controller.DeleteUser("user123");

            // Assert
            Assert.IsTrue(saveChangesCalled, "SaveChangesAsync was not called");
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }
    }
}