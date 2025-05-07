using System.Net.Mail;
using System.Net;
using System.Text;
using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace Autominus.Server.Services
{
    public class EmailService
    {
        public static async Task SendEmailForSuccessfulRegistration(string emailToSend)
        {
            var fromEmail = ConfigurationManager.AppSettings.Get("email");
            var fromEmailPassword = ConfigurationManager.AppSettings.Get("emailPassword");

            // sets up the Smtp Client
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "smtp.gmail.com";
            smtp.Port = 587;
            // tells Smtp Client that specific credentials will be used
            smtp.UseDefaultCredentials = false;

            // required, email needs to be secure/encrypted
            smtp.EnableSsl = true;
            // fromEmail credentials set
            smtp.Credentials = new NetworkCredential(fromEmail, fromEmailPassword);
            var email = await BuildEmailForSuccessfulRegistration(emailToSend);
            try
            {
                smtp.Send(email);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex}");
            }
        }
        public static async Task<MailMessage> BuildEmailForSuccessfulRegistration(string emailToSend)
        {
            
            var fromEmail = new MailAddress(ConfigurationManager.AppSettings.Get("email"));

            var email = new MailMessage();
            email.From = fromEmail;
            email.To.Add(emailToSend);

            email.Subject = "Successful registration!";
            
            email.Body = "Congratulations! You have successfully registered for the Autominus application. " +
                "We are excited to have you on board. If you have any questions or need assistance, " +
                "feel free to reach out to us.\n\nBest regards,\nThe Autominus Team";

            return email;
        }
    }
}
