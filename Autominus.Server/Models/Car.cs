namespace Autominus.Server.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public int Year { get; set; }
        public int Mileage { get; set; }
        public string? FuelType { get; set; }
        public string? Transmission { get; set; }
        public decimal EngineCapacity { get; set; }
        public int Horsepower { get; set; }
        public string? Drivetrain { get; set; }
        public int Doors { get; set; }
        public int Seats { get; set; }
        public string? BodyType { get; set; }
        public string? Color { get; set; }
        public string? VIN { get; set; }
        public string? RegistrationNumber { get; set; } 
        public string? Condition { get; set; }
        public bool AccidentHistory { get; set; }
        public DateTime? TechnicalInspectionValidUntil { get; set; }
        public decimal Price { get; set; }
        public bool Negotiable { get; set; }
        public string? Description { get; set; }
        public List<string>? ImageUrls { get; set; }
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigacijos savybė: automobilis priklauso vartotojui
        public User User { get; set; }
    }
}
