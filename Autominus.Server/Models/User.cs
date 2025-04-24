using Autominus.Server.Models;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? City { get; set; }
    public string? Street { get; set; }
    public string? Address { get; set; }

    // Navigacijos savybė: vartotojas gali turėti kelis automobilius
    [JsonIgnore]
    public ICollection<Car>? Cars { get; set; }
}

