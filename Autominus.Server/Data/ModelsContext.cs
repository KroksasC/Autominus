using Autominus.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Autominus.Server.Data
{
    public class ModelsContext : IdentityDbContext<User>
    {
        public ModelsContext(DbContextOptions options) : base(options) { }

        public DbSet<Car> Cars { get; set; } = null!;
        //public DbSet<User> Users { get; set; } = null!;
    }
}
