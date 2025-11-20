# Simple WebRTC Video Calling App

A minimal peer-to-peer video calling demo built with WebRTC.  
Uses `RTCPeerConnection`, `getUserMedia`, and a basic signaling mechanism (WebSocket or any custom backend) to establish a direct connection between two clients.

---

## Features
- Real-time audio/video streaming between two peers
- Simple UI with local and remote video elements
- ICE candidate exchange
- STUN server support for NAT traversal

---

## How It Works
1. **User media**: The browser captures video/audio using `getUserMedia()`.
2. **Peer connection**: Each client creates an `RTCPeerConnection`.
3. **Offer/Answer exchange**: One client creates an offer, the other responds with an answer.
4. **ICE candidates**: Both peers exchange ICE candidates until a direct connection is possible.
5. **Direct streaming**: Once connected, media flows peer-to-peer with no server involvement.


# video-calling-project
