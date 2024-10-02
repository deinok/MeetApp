using MeetApp.Database.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace MeetApp.Services
{

    public class EmailSender : IEmailSender<User>
    {

        public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
        {
            await Task.CompletedTask;
        }

        public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
        {
            await Task.CompletedTask;
        }

        public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
        {
            await Task.CompletedTask;
        }

    }

}
