using Autominus.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Autominus.Server.Data
{
    public class ModelsContext : DbContext
    {
        public ModelsContext(DbContextOptions options) : base(options) { }

        public DbSet<Car> Cars { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
    }
}
