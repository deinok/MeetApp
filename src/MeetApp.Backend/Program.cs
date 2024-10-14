using MeetApp.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace MeetApp.Backend
{

    public class Program
    {

        public static async Task Main(string[] args)
        {
            var webApplicationBuilder = WebApplication.CreateBuilder(args);
            webApplicationBuilder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddBearerToken();
            webApplicationBuilder.Services.AddControllers();
            webApplicationBuilder.Services.AddDbContextPool<AppDbContext>(dbContextOptionsBuilder =>
            {
                dbContextOptionsBuilder.EnableDetailedErrors();
                dbContextOptionsBuilder.EnableSensitiveDataLogging();
                dbContextOptionsBuilder.UseNpgsql(webApplicationBuilder.Configuration.GetConnectionString(nameof(AppDbContext)), npgsqlOptionsAction =>
                {
                    npgsqlOptionsAction.CommandTimeout(120);
                    npgsqlOptionsAction.EnableRetryOnFailure();
                    npgsqlOptionsAction.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                });
            });
            webApplicationBuilder.Services.AddEndpointsApiExplorer();
            webApplicationBuilder.Services.AddSwaggerGen();
            var webApplication = webApplicationBuilder.Build();
            webApplication.UseStaticFiles();
            webApplication.UseSwagger();
            webApplication.UseSwaggerUI();
            webApplication.UseHttpsRedirection();
            webApplication.UseAuthorization();
            webApplication.MapControllers();
            webApplication.MapFallbackToFile("index.html");

            {
                using var asyncServiceScope = webApplication.Services.CreateAsyncScope();
                var appDbContext = asyncServiceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                await appDbContext.Database.MigrateAsync();
            }

            await webApplication.RunAsync();
        }

    }

}
