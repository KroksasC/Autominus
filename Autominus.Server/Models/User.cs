using Autominus.Server.Models;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

public class User : IdentityUser
{
    // Navigacijos savybė: vartotojas gali turėti kelis automobilius
    [JsonIgnore]
    public ICollection<Car>? Cars { get; set; }
}

