using MeetApp.Database;
using MeetApp.Database.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MeetApp.Backend.Hubs
{

    public class ChatHub(
        AppDbContext appDbContext,
        TimeProvider timeProvider
    ) : Hub<ChatHub.IClient>
    {

        private readonly AppDbContext appDbContext = appDbContext;
        private readonly TimeProvider timeProvider = timeProvider;

        public async Task JoinChat(Guid userId, Guid activityId)
        {
            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, activityId.ToString());
            await this.Clients.OthersInGroup(activityId.ToString()).NotifyJoinChat(userId, activityId);
        }

        public async Task SendMessage(Guid userId, Guid activityId, string message)
        {
            var activity = await this.appDbContext.Activities
                .Where(x => x.Id == activityId)
                .SingleAsync();
            var user = await this.appDbContext.Users
                .Where(x => x.Id == userId)
                .SingleAsync();
            var activityMessage = new ActivityMessage
            {
                Activity = activity,
                Message = message,
                Timestamp = this.timeProvider.GetLocalNow(),
                User = user,
            };
            this.appDbContext.ActivityMessages.Add(activityMessage);
            _ = await this.appDbContext.SaveChangesAsync();
            await this.Clients.OthersInGroup(activityId.ToString()).NotifySendMessage(userId, activityId, message);
        }

        public interface IClient
        {
            Task NotifyJoinChat(Guid userId, Guid activityId);
            Task NotifySendMessage(Guid userId, Guid activityId, string message);
        }

    }

}
