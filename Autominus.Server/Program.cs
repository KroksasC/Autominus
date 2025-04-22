using Autominus.Server.Data;
using Autominus.Server.Services;

//using Autominus.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ModelsContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("ModelsContext") ?? throw new InvalidOperationException("Connection string 'ModelsCOntext' not found.")));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<ModelsContext>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("https://localhost:55103") // Your frontend URL
               .AllowAnyMethod() // Allow any HTTP method (GET, POST, etc.)
               .AllowAnyHeader() // Allow any headers
               .AllowCredentials(); // Allow cookies if needed
    });
});

builder.Services.AddScoped<LoginService>();
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ModelsContext>();
    context.Database.Migrate();
}

app.MapPost("/log", async ([FromBody] LoginRequest request, LoginService loginService) =>
{
    return await loginService.LoginAsync(request);
});

app.MapPost("/logout", async (SignInManager<User> signInManager) =>
{

    await signInManager.SignOutAsync();
    return Results.Ok();

});


app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email); // get the user's email from the claim
    return Results.Json(new { Email = email }); ; // return the email as a plain text response
}).RequireAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapIdentityApi<User>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowFrontend");

app.MapFallbackToFile("/index.html");

app.Run();
