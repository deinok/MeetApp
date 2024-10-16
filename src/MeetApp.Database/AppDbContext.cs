using MeetApp.Database.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace MeetApp.Database
{

    public class AppDbContext : IdentityDbContext<User, Role, Guid>
    {

        public virtual DbSet<Offer> Offers { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions) { }

    }

}
