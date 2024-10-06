using MeetApp.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;

namespace MeetApp
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
                dbContextOptionsBuilder.UseInMemoryDatabase("MeetApp");
            });
            webApplicationBuilder.Services.AddEndpointsApiExplorer();
            webApplicationBuilder.Services.AddSwaggerGen();
            var webApplication = webApplicationBuilder.Build();
            if (webApplication.Environment.IsDevelopment())
            {
                webApplication.UseSwagger();
                webApplication.UseSwaggerUI();
            }
            webApplication.UseHttpsRedirection();
            webApplication.UseAuthorization();
            webApplication.MapControllers();
            await webApplication.RunAsync();
        }

    }

}
