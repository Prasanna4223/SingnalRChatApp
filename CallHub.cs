using Microsoft.AspNetCore.SignalR;

namespace SignalRChatApplication
{
    public class CallHub : Hub
    {
        private static Dictionary<string, string> _connections = new Dictionary<string, string>();
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
        public override Task OnConnectedAsync()
        {
            _connections[Context.ConnectionId] = Context.ConnectionId;
            return base.OnConnectedAsync();
        }

        // Track when a user disconnects
        public override Task OnDisconnectedAsync(Exception exception)
        {
            _connections.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

    }
}
