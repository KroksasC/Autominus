using Autominus.Server.Controllers;
using Autominus.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Auto.tests
{
    /// <summary>
    /// Integration and unit tests for UserController endpoints using in-memory EF Core context.
    /// </summary>
    [TestClass]
    public sealed class UserControllerTests
    {
        /// <summary>
        /// Creates a new in-memory database context and optionally seeds it with a default user.(STUB)
        /// </summary>
        /// <param name="seed">Whether to seed the database with a default user.</param>
        /// <returns>In-memory <see cref="ModelsContext"/>.</returns>
        private ModelsContext GetDbContext(bool seed = true)
        {
            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ModelsContext(options);

            if (seed)
            {
                context.Users.Add(new User
                {
                    Id = "user123",
                    UserName = "testuser",
                    Email = "test@example.com"
                });
                context.SaveChanges();
            }

            return context;
        }

        /// <summary>
        /// Verifies that GetUser returns NotFound when the user does not exist in the database.
        /// </summary>
        [TestMethod]
        public async Task GetUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new UserController(context);

            // Act
            var result = await controller.GetUser("nonexistent");

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        /// <summary>
        /// Verifies that GetUsers returns a non-null result when users exist in the database.
        /// </summary>
        [TestMethod]
        public async Task GetUser_ShouldNotReturnNull_WhenUserExists()
        {
            // Arrange
            var context = GetDbContext();
            var controller = new UserController(context);

            // Act
            var result = await controller.GetUsers();

            // Assert
            Assert.IsNotNull(result);
        }

        /// <summary>
        /// Verifies that DeleteUser returns NoContent when the user exists and is deleted.
        /// </summary>
        [TestMethod]
        public async Task DeleteUser_ShouldReturnNoContent_WhenUserExists()
        {
            // Arrange
            var context = GetDbContext(seed: false);
            context.Users.Add(new User
            {
                Id = "user123",
                UserName = "deletableUser",
                Email = "delete@example.com"
            });
            context.SaveChanges();


            // Act
            var controller = new UserController(context);
            var result = await controller.DeleteUser("user123");


            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        /// <summary>
        /// Verifies that DeleteUser returns NotFound when the user does not exist.
        /// </summary>
        [TestMethod]
        public async Task DeleteUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var context = GetDbContext(seed: false);
            var controller = new UserController(context);

            // Act
            var result = await controller.DeleteUser("nonexistent");

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        /// <summary>
        /// Verifies that PutUser updates the user and returns NoContent when user exists.
        /// </summary>
        [TestMethod]
        public async Task PutUser_ShouldReturnNoContent_WhenUserIsUpdatedSuccessfully()
        {
            // Arrange
            var context = GetDbContext(seed: false);
            context.Users.Add(new User
            {
                Id = "user123",
                UserName = "olduser",
                Email = "old@example.com"
            });
            context.SaveChanges();

            var controller = new UserController(context);

            var updatedUser = new User
            {
                Id = "user123",
                UserName = "newuser",
                Email = "new@example.com"
            };

            // Act
            var result = await controller.PutUser("user123", updatedUser);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));

            var userInDb = await context.Users.FindAsync("user123");
            Assert.AreEqual("newuser", userInDb?.UserName);
            Assert.AreEqual("new@example.com", userInDb?.Email);
        }

        /// <summary>
        /// Verifies that PutUser returns BadRequest when route ID does not match model ID.
        /// </summary>
        [TestMethod]
        public async Task PutUser_ShouldReturnBadRequest_WhenIdsDoNotMatch()
        {
            // Arrange
            var context = GetDbContext(seed: false);
            var controller = new UserController(context);

            var user = new User
            {
                Id = "differentId",
                UserName = "user",
                Email = "email@example.com"
            };

            // Act
            var result = await controller.PutUser("urlId", user);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestResult));
        }

        /// <summary>
        /// Unit test that ensures SaveChangesAsync is called when deleting an existing user.
        /// </summary>
        [TestMethod]
        public async Task DeleteUser_ShouldCallSaveChanges_WhenUserExists()
        {
            // Arrange
            var context = GetDbContext(seed: false);
            var testUser = new User
            {
                Id = "user123",
                UserName = "deletableUser",
                Email = "delete@example.com"
            };
            context.Users.Add(testUser);
            await context.SaveChangesAsync();

            var saveChangesCalled = false;

            var options = new DbContextOptionsBuilder<ModelsContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var mockContext = new Mock<ModelsContext>(options) { CallBase = true };

            mockContext.Setup(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Callback(() => saveChangesCalled = true)
                .ReturnsAsync(1);

            mockContext.Setup(m => m.Users).Returns(context.Users);
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

