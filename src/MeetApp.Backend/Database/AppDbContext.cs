using MeetApp.Backend.Database.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace MeetApp.Backend.Database
{

    public class AppDbContext : IdentityDbContext<User, Role, Guid>
    {

        public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions) { }

    }

}
