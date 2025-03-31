//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using System.Security.Claims;

//[Route("[controller]")]
//[ApiController]
//public class AuthController : ControllerBase
//{
//    private readonly UserManager<User> _userManager;
//    private readonly SignInManager<User> _signInManager;

//    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
//    {
//        _userManager = userManager;
//        _signInManager = signInManager;
//    }

//    [HttpPost("logout")]
//    [Authorize] // Requires authentication
//    public async Task<IActionResult> Logout()
//    {
//        await _signInManager.SignOutAsync();
//        return Ok(new { message = "Logged out successfully" });
//    }

//    [HttpGet("pingauth")]
//    [Authorize] // Requires authentication
//    public IActionResult PingAuth()
//    {
//        var email = User.FindFirstValue(ClaimTypes.Email);
//        return Ok(new { Email = email });
//    }

//    // Define a separate model for registration
//    public class RegisterModel
//    {
//        public string Email { get; set; }
//        public string Password { get; set; }
//    }
//}
