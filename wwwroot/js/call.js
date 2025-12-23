let localStream;
let peerConnection;
let myConnectionId;
let selectedUserId = null;

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const callHub = new signalR.HubConnectionBuilder().withUrl("/callHub").build();

// Start connection
callHub.start().then(() => {
    const userName = prompt("Enter your name:");
    if (userName) {
        callHub.invoke("RegisterUser", userName);
    }
}).catch(err => console.error(err));

// Update user list
callHub.on("UpdateUserList", (users) => {
    const listEl = document.getElementById("activeUsersList");
    listEl.innerHTML = "";

    users.forEach(user => {
        if (user.id !== callHub.connectionId) { // Don't show yourself
            const li = document.createElement("li");
            li.textContent = user.name;
            li.onclick = () => startCall(user.id, user.name);
            li.style.cursor = "pointer";
            li.style.padding = "10px";
            li.style.margin = "5px 0";
            li.style.background = "#34495e";
            li.style.borderRadius = "5px";
            li.onmouseover = () => li.style.background = "#1abc9c";
            li.onmouseout = () => li.style.background = "#34495e";
            listEl.appendChild(li);
        }
    });
});

// Start call when user clicks
async function startCall(userId, userName) {
    if (!confirm(`Call ${userName}?`)) return;

    selectedUserId = userId;
    await startLocalStream();

    peerConnection = new RTCPeerConnection(config);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = e => {
        if (e.candidate) {
            callHub.invoke("SendIceCandidate", userId, JSON.stringify(e.candidate));
        }
    };

    peerConnection.ontrack = e => {
        remoteVideo.srcObject = e.streams[0];
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await callHub.invoke("SendOffer", userId, JSON.stringify(offer));
}

// Receive incoming call
callHub.on("ReceiveOffer", async (callerId, offer) => {
    if (!confirm("Incoming call. Accept?")) {
        await callHub.invoke("RejectCall", callerId);
        return;
    }

    selectedUserId = callerId;
    await startLocalStream();

    peerConnection = new RTCPeerConnection(config);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = e => {
        if (e.candidate) {
            callHub.invoke("SendIceCandidate", callerId, JSON.stringify(e.candidate));
        }
    };

    peerConnection.ontrack = e => {
        remoteVideo.srcObject = e.streams[0];
    };

    await peerConnection.setRemoteDescription(JSON.parse(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    await callHub.invoke("SendAnswer", callerId, JSON.stringify(answer));
});

callHub.on("ReceiveAnswer", async (answer) => {
    await peerConnection.setRemoteDescription(JSON.parse(answer));
});

callHub.on("ReceiveIceCandidate", async (senderId, candidate) => {
    if (peerConnection) {
        await peerConnection.addIceCandidate(JSON.parse(candidate));
    }
});

async function startLocalStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (err) {
        alert("Could not access camera/microphone");
        throw err;
    }
}

// End call button
document.getElementById("endCall").onclick = () => {
    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
};
