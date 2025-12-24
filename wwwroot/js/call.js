//let localStream;
//let peerConnection;
//let myConnectionId;
//let selectedUserId = null;

//const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
//const localVideo = document.getElementById("localVideo");
//const remoteVideo = document.getElementById("remoteVideo");

//const callHub = new signalR.HubConnectionBuilder().withUrl("/callHub").build();

//// Start connection
//callHub.start().then(() => {
//    const userName = prompt("Enter your name:");
//    if (userName) {
//        callHub.invoke("RegisterUser", userName);
//    }
//}).catch(err => console.error(err));

//// Update user list
//callHub.on("UpdateUserList", (users) => {
//    const listEl = document.getElementById("activeUsersList");
//    listEl.innerHTML = "";

//    users.forEach(user => {
//        if (user.id !== callHub.connectionId) { // Don't show yourself
//            const li = document.createElement("li");
//            li.textContent = user.name;
//            li.onclick = () => startCall(user.id, user.name);
//            li.style.cursor = "pointer";
//            li.style.padding = "10px";
//            li.style.margin = "5px 0";
//            li.style.background = "#34495e";
//            li.style.borderRadius = "5px";
//            li.onmouseover = () => li.style.background = "#1abc9c";
//            li.onmouseout = () => li.style.background = "#34495e";
//            listEl.appendChild(li);
//        }
//    });
//});

//// Start call when user clicks
//async function startCall(userId, userName) {
//    if (!confirm(`Call ${userName}?`)) return;

//    selectedUserId = userId;
//    await startLocalStream();

//    peerConnection = new RTCPeerConnection(config);
//    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//    peerConnection.onicecandidate = e => {
//        if (e.candidate) {
//            callHub.invoke("SendIceCandidate", userId, JSON.stringify(e.candidate));
//        }
//    };

//    peerConnection.ontrack = e => {
//        remoteVideo.srcObject = e.streams[0];
//    };

//    const offer = await peerConnection.createOffer();
//    await peerConnection.setLocalDescription(offer);
//    await callHub.invoke("SendOffer", userId, JSON.stringify(offer));
//}

//// Receive incoming call
//callHub.on("ReceiveOffer", async (callerId, offer) => {
//    if (!confirm("Incoming call. Accept?")) {
//        await callHub.invoke("RejectCall", callerId);
//        return;
//    }

//    selectedUserId = callerId;
//    await startLocalStream();

//    peerConnection = new RTCPeerConnection(config);
//    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//    peerConnection.onicecandidate = e => {
//        if (e.candidate) {
//            callHub.invoke("SendIceCandidate", callerId, JSON.stringify(e.candidate));
//        }
//    };

//    peerConnection.ontrack = e => {
//        remoteVideo.srcObject = e.streams[0];
//    };

//    await peerConnection.setRemoteDescription(JSON.parse(offer));
//    const answer = await peerConnection.createAnswer();
//    await peerConnection.setLocalDescription(answer);
//    await callHub.invoke("SendAnswer", callerId, JSON.stringify(answer));
//});

//callHub.on("ReceiveAnswer", async (answer) => {
//    await peerConnection.setRemoteDescription(JSON.parse(answer));
//});

//callHub.on("ReceiveIceCandidate", async (senderId, candidate) => {
//    if (peerConnection) {
//        await peerConnection.addIceCandidate(JSON.parse(candidate));
//    }
//});

//async function startLocalStream() {
//    try {
//        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//        localVideo.srcObject = localStream;
//    } catch (err) {
//        alert("Could not access camera/microphone");
//        throw err;
//    }
//}

//// End call button
//document.getElementById("endCall").onclick = () => {
//    if (peerConnection) peerConnection.close();
//    if (localStream) localStream.getTracks().forEach(t => t.stop());
//    localVideo.srcObject = null;
//    remoteVideo.srcObject = null;
//};

//let peerConnection;
//let myConnectionId;
//let selectedUserId = null;

//const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
//const localVideo = document.getElementById("localVideo");
//const remoteVideo = document.getElementById("remoteVideo");

//const callHub = new signalR.HubConnectionBuilder().withUrl("/callHub").build();

//// Start connection
//callHub.start().then(() => {
//    const userName = prompt("Enter your name:");
//    if (userName) {
//        callHub.invoke("RegisterUser", userName);
//    }
//    console.log("✅ Connected to SignalR");
//}).catch(err => console.error(err));

//// Update user list
//callHub.on("UpdateUserList", (users) => {
//    console.log("📋 User list updated:", users);
//    const listEl = document.getElementById("activeUsersList");
//    listEl.innerHTML = "";

//    users.forEach(user => {
//        if (user.id !== callHub.connectionId) {
//            const li = document.createElement("li");
//            li.textContent = user.name;
//            li.onclick = () => startCall(user.id, user.name);
//            li.style.cursor = "pointer";
//            li.style.padding = "10px";
//            li.style.margin = "5px 0";
//            li.style.background = "#34495e";
//            li.style.borderRadius = "5px";
//            li.onmouseover = () => li.style.background = "#1abc9c";
//            li.onmouseout = () => li.style.background = "#34495e";
//            listEl.appendChild(li);
//        }
//    });
//});

//// Create fake video stream (colored canvas) for testing
//function createFakeStream() {
//    const canvas = document.createElement('canvas');
//    canvas.width = 640;
//    canvas.height = 480;
//    const ctx = canvas.getContext('2d');

//    // Draw a colored rectangle with text
//    ctx.fillStyle = '#1abc9c';
//    ctx.fillRect(0, 0, canvas.width, canvas.height);
//    ctx.fillStyle = 'white';
//    ctx.font = '30px Arial';
//    ctx.fillText('Test Video Stream', 200, 240);

//    // Animate it slightly
//    setInterval(() => {
//        ctx.fillStyle = `hsl(${Date.now() % 360}, 70%, 50%)`;
//        ctx.fillRect(0, 0, canvas.width, canvas.height);
//        ctx.fillStyle = 'white';
//        ctx.font = '30px Arial';
//        ctx.fillText('Connected - No Camera', 150, 240);
//    }, 100);

//    return canvas.captureStream(30); // 30 fps
//}

//// Start call when user clicks
//async function startCall(userId, userName) {
//    if (!confirm(`Call ${userName}?`)) return;

//    console.log("📞 Starting call to:", userName);
//    selectedUserId = userId;

//    // Create fake stream for testing
//    const fakeStream = createFakeStream();
//    localVideo.srcObject = fakeStream;
//    console.log("✅ Local fake stream created");

//    peerConnection = new RTCPeerConnection(config);
//    fakeStream.getTracks().forEach(track => {
//        peerConnection.addTrack(track, fakeStream);
//        console.log("➕ Added track:", track.kind);
//    });

//    peerConnection.onicecandidate = e => {
//        if (e.candidate) {
//            console.log("🧊 Sending ICE candidate");
//            callHub.invoke("SendIceCandidate", userId, JSON.stringify(e.candidate));
//        }
//    };

//    peerConnection.ontrack = e => {
//        console.log("✅ Received remote track!");
//        remoteVideo.srcObject = e.streams[0];
//    };

//    peerConnection.onconnectionstatechange = () => {
//        console.log("🔗 Connection state:", peerConnection.connectionState);
//    };

//    const offer = await peerConnection.createOffer();
//    await peerConnection.setLocalDescription(offer);
//    console.log("📤 Sending offer");
//    await callHub.invoke("SendOffer", userId, JSON.stringify(offer));
//}

//// Receive incoming call
//callHub.on("ReceiveOffer", async (callerId, offer) => {
//    console.log("📞 Incoming call from:", callerId);

//    if (!confirm("Incoming call. Accept?")) {
//        await callHub.invoke("RejectCall", callerId);
//        return;
//    }

//    selectedUserId = callerId;

//    // Create fake stream for testing
//    const fakeStream = createFakeStream();
//    localVideo.srcObject = fakeStream;
//    console.log("✅ Local fake stream created");

//    peerConnection = new RTCPeerConnection(config);
//    fakeStream.getTracks().forEach(track => {
//        peerConnection.addTrack(track, fakeStream);
//        console.log("➕ Added track:", track.kind);
//    });

//    peerConnection.onicecandidate = e => {
//        if (e.candidate) {
//            console.log("🧊 Sending ICE candidate");
//            callHub.invoke("SendIceCandidate", callerId, JSON.stringify(e.candidate));
//        }
//    };

//    peerConnection.ontrack = e => {
//        console.log("✅ Received remote track!");
//        remoteVideo.srcObject = e.streams[0];
//    };

//    peerConnection.onconnectionstatechange = () => {
//        console.log("🔗 Connection state:", peerConnection.connectionState);
//    };

//    await peerConnection.setRemoteDescription(JSON.parse(offer));
//    const answer = await peerConnection.createAnswer();
//    await peerConnection.setLocalDescription(answer);
//    console.log("📤 Sending answer");
//    await callHub.invoke("SendAnswer", callerId, JSON.stringify(answer));
//});

//callHub.on("ReceiveAnswer", async (answer) => {
//    console.log("📥 Received answer");
//    await peerConnection.setRemoteDescription(JSON.parse(answer));
//});

//callHub.on("ReceiveIceCandidate", async (senderId, candidate) => {
//    console.log("🧊 Received ICE candidate");
//    if (peerConnection) {
//        await peerConnection.addIceCandidate(JSON.parse(candidate));
//    }
//});

//callHub.on("CallRejected", () => {
//    alert("Call was rejected");
//    console.log("❌ Call rejected");
//});

//// End call button
//document.getElementById("endCall").onclick = () => {
//    console.log("📴 Ending call");
//    if (peerConnection) peerConnection.close();
//    localVideo.srcObject = null;
//    remoteVideo.srcObject = null;
//};


let localStream;
let peerConnection;
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
    console.log("✅ SignalR Connected");
}).catch(err => console.error("❌ SignalR Error:", err));

// Update user list
callHub.on("UpdateUserList", (users) => {
    console.log("📋 Users:", users);
    const listEl = document.getElementById("activeUsersList");
    listEl.innerHTML = "";

    users.forEach(user => {
        if (user.id !== callHub.connectionId) {
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

// Get REAL camera and microphone
async function startLocalStream() {
    console.log("📹 Requesting camera and mic...");
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        localVideo.srcObject = localStream;
        console.log("✅ Camera/Mic accessed!");
        console.log("   Video tracks:", localStream.getVideoTracks().length);
        console.log("   Audio tracks:", localStream.getAudioTracks().length);

        // Force video to play
        localVideo.play().catch(e => console.error("Local video play error:", e));

        return true;
    } catch (err) {
        console.error("❌ Camera/Mic Error:", err.name, err.message);
        alert("Cannot access camera/mic: " + err.message);
        return false;
    }
}

// Start call
async function startCall(userId, userName) {
    if (!confirm(`Call ${userName}?`)) return;

    console.log("📞 Calling:", userName);
    selectedUserId = userId;

    // Get camera/mic FIRST
    const gotMedia = await startLocalStream();
    if (!gotMedia) return;

    // Create peer connection
    peerConnection = new RTCPeerConnection(config);

    // Add local tracks
    localStream.getTracks().forEach(track => {
        console.log("➕ Adding local track:", track.kind, track.enabled);
        peerConnection.addTrack(track, localStream);
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = e => {
        if (e.candidate) {
            console.log("🧊 Sending ICE candidate");
            callHub.invoke("SendIceCandidate", userId, JSON.stringify(e.candidate));
        }
    };

    // Handle incoming remote tracks
    peerConnection.ontrack = e => {
        console.log("✅ RECEIVED REMOTE TRACK:", e.track.kind);
        console.log("   Stream ID:", e.streams[0].id);
        console.log("   Track enabled:", e.track.enabled);
        console.log("   Track ready state:", e.track.readyState);

        remoteVideo.srcObject = e.streams[0];

        // Force remote video to play
        remoteVideo.play().then(() => {
            console.log("✅ Remote video playing!");
        }).catch(err => {
            console.error("❌ Remote video play error:", err);
        });
    };

    // Monitor connection state
    peerConnection.onconnectionstatechange = () => {
        console.log("🔗 Connection state:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log("🧊 ICE state:", peerConnection.iceConnectionState);
    };

    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("📤 Sending offer");
    await callHub.invoke("SendOffer", userId, JSON.stringify(offer));
}

// Receive incoming call
callHub.on("ReceiveOffer", async (callerId, offer) => {
    console.log("📞 INCOMING CALL from:", callerId);

    if (!confirm("Incoming call. Accept?")) {
        await callHub.invoke("RejectCall", callerId);
        return;
    }

    selectedUserId = callerId;

    // Get camera/mic FIRST
    const gotMedia = await startLocalStream();
    if (!gotMedia) return;

    // Create peer connection
    peerConnection = new RTCPeerConnection(config);

    // Add local tracks
    localStream.getTracks().forEach(track => {
        console.log("➕ Adding local track:", track.kind, track.enabled);
        peerConnection.addTrack(track, localStream);
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = e => {
        if (e.candidate) {
            console.log("🧊 Sending ICE candidate");
            callHub.invoke("SendIceCandidate", callerId, JSON.stringify(e.candidate));
        }
    };

    // Handle incoming remote tracks
    peerConnection.ontrack = e => {
        console.log("✅ RECEIVED REMOTE TRACK:", e.track.kind);
        console.log("   Stream ID:", e.streams[0].id);
        console.log("   Track enabled:", e.track.enabled);
        console.log("   Track ready state:", e.track.readyState);

        remoteVideo.srcObject = e.streams[0];

        // Force remote video to play
        remoteVideo.play().then(() => {
            console.log("✅ Remote video playing!");
        }).catch(err => {
            console.error("❌ Remote video play error:", err);
        });
    };

    // Monitor connection state
    peerConnection.onconnectionstatechange = () => {
        console.log("🔗 Connection state:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log("🧊 ICE state:", peerConnection.iceConnectionState);
    };

    // Set remote description and create answer
    await peerConnection.setRemoteDescription(JSON.parse(offer));
    console.log("📥 Set remote description (offer)");

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log("📤 Sending answer");
    await callHub.invoke("SendAnswer", callerId, JSON.stringify(answer));
});

callHub.on("ReceiveAnswer", async (answer) => {
    console.log("📥 Received answer");
    await peerConnection.setRemoteDescription(JSON.parse(answer));
    console.log("✅ Set remote description (answer)");
});

callHub.on("ReceiveIceCandidate", async (senderId, candidate) => {
    console.log("🧊 Received ICE candidate");
    if (peerConnection) {
        await peerConnection.addIceCandidate(JSON.parse(candidate));
    }
});

callHub.on("CallRejected", () => {
    alert("Call rejected");
    console.log("❌ Call rejected");
});

// End call
document.getElementById("endCall").onclick = () => {
    console.log("📴 Ending call");
    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
};
