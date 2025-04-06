using Microsoft.AspNetCore.Mvc;

namespace Autominus.Server.Models
{
    public class UploadDto
    {
        [FromForm(Name = "userId")]
        public int UserId { get; set; }

        [FromForm(Name = "brand")]
        public string Brand { get; set; }

        [FromForm(Name = "model")]
        public string Model { get; set; }

        [FromForm(Name = "year")]
        public int Year { get; set; }

        [FromForm(Name = "mileage")]
        public int Mileage { get; set; }

        [FromForm(Name = "fuelType")]
        public string FuelType { get; set; }

        [FromForm(Name = "transmission")]
        public string Transmission { get; set; }

        [FromForm(Name = "engineCapacity")]
        public decimal EngineCapacity { get; set; }

        [FromForm(Name = "horsepower")]
        public int Horsepower { get; set; }

        [FromForm(Name = "drivetrain")]
        public string Drivetrain { get; set; }

        [FromForm(Name = "doors")]
        public int Doors { get; set; }

        [FromForm(Name = "seats")]
        public int Seats { get; set; }

        [FromForm(Name = "bodyType")]
        public string BodyType { get; set; }

        [FromForm(Name = "color")]
        public string Color { get; set; }

        [FromForm(Name = "vin")]
        public string VIN { get; set; }

        [FromForm(Name = "registrationNumber")]
        public string RegistrationNumber { get; set; }

        [FromForm(Name = "condition")]
        public string Condition { get; set; }

        [FromForm(Name = "accidentHistory")]
        public bool AccidentHistory { get; set; }

        [FromForm(Name = "technicalInspectionValidUntil")]
        public DateTime? TechnicalInspectionValidUntil { get; set; }

        [FromForm(Name = "price")]
        public decimal Price { get; set; }

        [FromForm(Name = "negotiable")]
        public bool Negotiable { get; set; }

        [FromForm(Name = "description")]
        public string Description { get; set; }

        [FromForm(Name = "location")]
        public string Location { get; set; }

        [FromForm(Name = "images")]
        public List<IFormFile> Images { get; set; }
    }
}
