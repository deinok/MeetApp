using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MeetApp.Database.Internal
{

    internal class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {

        public AppDbContext CreateDbContext(string[] args)
        {
            var dbContextOptionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            dbContextOptionsBuilder.UseNpgsql();
            return new AppDbContext(dbContextOptionsBuilder.Options);
        }

    }

}
