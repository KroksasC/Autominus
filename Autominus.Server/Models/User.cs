using Autominus.Server.Models;
using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? Role { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigacijos savybė: vartotojas gali turėti kelis automobilius
    [JsonIgnore]
    public ICollection<Car>? Cars { get; set; }
}

