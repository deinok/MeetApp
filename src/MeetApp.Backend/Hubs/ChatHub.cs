using MeetApp.Database;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace MeetApp.Backend.Hubs
{

    public class ChatHub(
        AppDbContext appDbContext    
    ) : Hub<ChatHub.IClient>
    {

        private readonly AppDbContext appDbContext = appDbContext;

        public async Task JoinChat(Guid userId, Guid activityId)
        {
            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, activityId.ToString());
            await this.Clients.OthersInGroup(activityId.ToString()).NotifyJoinChat(userId, activityId);
        }

        public async Task SendMessage(Guid userId, Guid activityId, string message)
        {
            await Task.CompletedTask;
            throw new NotImplementedException();
        }

        public interface IClient
        {
            Task NotifyJoinChat(Guid userId, Guid activityId);
            Task NotifySendMessage(Guid userId, Guid activityId, string message);
        }

    }

}
