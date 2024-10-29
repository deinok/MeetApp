using MeetApp.Database;
using MeetApp.Database.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MeetApp.Backend
{

    public class Program
    {

        public static async Task Main(string[] args)
        {
            var webApplicationBuilder = WebApplication.CreateBuilder(args);
            webApplicationBuilder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer();
            webApplicationBuilder.Services.AddAuthorization();
            webApplicationBuilder.Services.AddControllers()
                .AddJsonOptions(jsonOptions =>
                {
                    jsonOptions.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });
            webApplicationBuilder.Services.AddCors(corsOptions =>
            {
                corsOptions.AddDefaultPolicy(corsPolicyBuilder =>
                {
                    corsPolicyBuilder.AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:5000")
                        .WithOrigins("https://localhost:5001")
                        .WithOrigins("http://localhost:5173")
                        .WithOrigins("https://meet-app-udl.azurewebsites.net");
                });
            });
            webApplicationBuilder.Services.AddAzureClients(azureClientFactoryBuilder => {
                azureClientFactoryBuilder.AddTextTranslationClient(new Azure.AzureKeyCredential("9H6l2PugYKvRYiyyJZdgOBA6fcdallj6T1UOrA7TGDWx1AE5fY0xJQQJ99AJACi5YpzXJ3w3AAAbACOGtfM1"));
            });
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
            webApplicationBuilder.Services.AddIdentity<User, Role>(identityOptions =>
            {
                identityOptions.Password.RequireDigit = false;
                identityOptions.Password.RequireLowercase = false;
                identityOptions.Password.RequireNonAlphanumeric = false;
                identityOptions.Password.RequireUppercase = false;
                identityOptions.Password.RequiredLength = 0;
            })
                .AddDefaultTokenProviders()
                .AddEntityFrameworkStores<AppDbContext>();
            webApplicationBuilder.Services.AddSwaggerGen();
            var webApplication = webApplicationBuilder.Build();
            webApplication.UseSwagger();
            webApplication.UseSwaggerUI();
            webApplication.UseHttpsRedirection();
            webApplication.UseStaticFiles();
            webApplication.UseRouting();
            webApplication.UseCors();
            webApplication.UseAuthentication();
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
