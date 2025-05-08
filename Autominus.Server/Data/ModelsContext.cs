namespace Autominus.Server.Data;


using Autominus.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class ModelsContext : IdentityDbContext<User>
    {
        public ModelsContext(DbContextOptions options) : base(options) { }

        public DbSet<Car> Cars { get; set; }
    }
