using Autominus.Server.Models;
using Autominus.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autominus.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> SendSuccessfulRegistrationEmail(EmailRequest emailRequest)
        {
            if (string.IsNullOrEmpty(emailRequest.Email))
            {
                return BadRequest("Email address is required.");
            }
            await EmailService.SendEmailForSuccessfulRegistration(emailRequest.Email);
            return Ok(new { message = "Email sent." });
        }
    }
    public class EmailRequest
    {
        public string Email { get; set; }
    }
}
