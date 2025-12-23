using Microsoft.AspNetCore.SignalR;

namespace SignalRChatApplication
{
    public class CallHub : Hub
    {
        private static Dictionary<string, string> _users = new Dictionary<string, string>(); // connectionId -> userName

        // Register user with name
        public async Task RegisterUser(string userName)
        {
            _users[Context.ConnectionId] = userName;
            await BroadcastUserList();
        }

        // Broadcast active users to everyone
        private async Task BroadcastUserList()
        {
            var userList = _users.Select(u => new { id = u.Key, name = u.Value }).ToList();
            await Clients.All.SendAsync("UpdateUserList", userList);
        }

        public async Task SendOffer(string receiverConnectionId, string offer)
        {
            await Clients.Client(receiverConnectionId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
        }

        public async Task SendAnswer(string callerConnectionId, string answer)
        {
            await Clients.Client(callerConnectionId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
        }

        public async Task SendIceCandidate(string userId, string candidate)
        {
            await Clients.Client(userId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
        }

        public async Task RejectCall(string callerId)
        {
            await Clients.Client(callerId).SendAsync("CallRejected", Context.ConnectionId);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _users.Remove(Context.ConnectionId);
            await BroadcastUserList();
            await base.OnDisconnectedAsync(exception);
        }
    }
}
