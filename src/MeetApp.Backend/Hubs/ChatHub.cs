using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MeetApp.Backend.Hubs
{

    public class ChatHub : Hub<ChatHub.IClient>
    {

        public async Task JoinChat(Guid activityId)
        {
            await Task.CompletedTask;
            throw new NotImplementedException();
        }

        public async Task SendMessage(Guid activityId, string message, string sourceLanguage)
        {
            _ = Thread.CurrentThread.CurrentCulture.ToString();
            await Task.CompletedTask;
            throw new NotImplementedException();
        }

        public interface IClient
        {
            Task NotifyJoinChat(Guid userId, Guid activityId);
            Task NotifySendMessage(Guid userId, Guid activityId);
        }

    }

}
