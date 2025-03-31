using Autominus.Server.Data;
using Autominus.Server.Models;
using Bogus;
using Microsoft.EntityFrameworkCore;

namespace Autominus.Server.Services
{
    public static class DataSeedingService
    {
        public static void Initialize(ModelsContext context)
        {
            context.Database.Migrate();

            if (!context.Users.Any()) // Check if users exist
            {
                var userFaker = new Faker<User>()
                    .RuleFor(u => u.Id, f => f.Random.Guid().ToString()) // Generating a unique Id
                    .RuleFor(u => u.UserName, f => f.Internet.UserName())
                    .RuleFor(u => u.Email, f => f.Internet.Email())
                    .RuleFor(u => u.PasswordHash, f => f.Random.Hash())
                    .RuleFor(u => u.NormalizedUserName, f => f.Internet.UserName().ToUpper()) // Normalized UserName
                    .RuleFor(u => u.NormalizedEmail, f => f.Internet.Email().ToUpper()) // Normalized Email
                    .RuleFor(u => u.EmailConfirmed, f => f.Random.Bool()) // Randomly setting EmailConfirmed
                    .RuleFor(u => u.SecurityStamp, f => f.Random.String(10)) // Random SecurityStamp
                    .RuleFor(u => u.ConcurrencyStamp, f => f.Random.String(10)) // Random ConcurrencyStamp
                    .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber()) // Random Phone Number
                    .RuleFor(u => u.PhoneNumberConfirmed, f => f.Random.Bool()) // Randomly setting PhoneNumberConfirmed
                    .RuleFor(u => u.TwoFactorEnabled, f => f.Random.Bool()) // Randomly setting TwoFactorEnabled
                    .RuleFor(u => u.LockoutEnd, f => f.Date.Future(1)) // LockoutEnd date in the future
                    .RuleFor(u => u.LockoutEnabled, f => f.Random.Bool()) // Randomly setting LockoutEnabled
                    .RuleFor(u => u.AccessFailedCount, f => f.Random.Int(0, 5)); // Random AccessFailedCount between 0 and 5

                var users = userFaker.Generate(10); // Create 10 users
                context.Users.AddRange(users);
                context.SaveChanges();

                var carFaker = new Faker<Car>()
                    .RuleFor(c => c.Brand, f => f.Vehicle.Manufacturer())
                    .RuleFor(c => c.Model, f => f.Vehicle.Model())
                    .RuleFor(c => c.Year, f => f.Date.Past(10).Year)
                    .RuleFor(c => c.Mileage, f => f.Random.Int(10000, 200000))
                    .RuleFor(c => c.FuelType, f => f.PickRandom("Petrol", "Diesel", "Electric", "Hybrid"))
                    .RuleFor(c => c.Transmission, f => f.PickRandom("Automatic", "Manual"))
                    .RuleFor(c => c.EngineCapacity, f => f.Random.Decimal(1.0m, 5.0m))
                    .RuleFor(c => c.Horsepower, f => f.Random.Int(70, 500))
                    .RuleFor(c => c.Drivetrain, f => f.PickRandom("FWD", "RWD", "AWD"))
                    .RuleFor(c => c.Doors, f => f.PickRandom(2, 4, 5))
                    .RuleFor(c => c.Seats, f => f.PickRandom(2, 4, 5, 7))
                    .RuleFor(c => c.BodyType, f => f.PickRandom("Sedan", "Hatchback", "SUV", "Coupe", "Convertible"))
                    .RuleFor(c => c.Color, f => f.Commerce.Color())
                    .RuleFor(c => c.VIN, f => f.Vehicle.Vin())
                    .RuleFor(c => c.RegistrationNumber, f => f.Random.AlphaNumeric(6).ToUpper())
                    .RuleFor(c => c.Condition, f => f.PickRandom("New", "Used"))
                    .RuleFor(c => c.AccidentHistory, f => f.Random.Bool(0.2f)) // 20% chance of being accidented
                    .RuleFor(c => c.TechnicalInspectionValidUntil, f => f.Date.Future(2))
                    .RuleFor(c => c.Price, f => f.Random.Decimal(5000, 100000))
                    .RuleFor(c => c.Negotiable, f => f.Random.Bool())
                    .RuleFor(c => c.Description, f => f.Lorem.Sentence())
                    .RuleFor(c => c.ImageUrls, f => new List<string> { f.Internet.Url() })
                    .RuleFor(c => c.Location, f => f.Address.City())
                    .RuleFor(c => c.CreatedAt, f => f.Date.Past(1))
                    .RuleFor(c => c.User, f => f.PickRandom(users));

                var cars = carFaker.Generate(20); // Create 20 random cars
                context.Cars.AddRange(cars);
                context.SaveChanges();
            }
        }
    }
}