class Peer {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({  ///now we are creating the peer previously we have created the signalling server
                iceServers: [
                    {
                        urls: [
                            'stun:stun.l.google.com:19302',
                            'stun:global.stun.twilio.com:3478',
                        ],
                    }
                ]
            })
        }
    }
    async getAnswer(offer){ //After an offer the other user is giving an answer (accepting the call as an answer)
        if(this.peer){
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();//creating an answer means we are accepting the call
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer
        }
    }
    async setLocalDescription(answer){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer))
        }
    }
    async getOffer() {
        if (this.peer) { 
            const offer = await this.peer.createOffer()//Here we are creating an offer
            await this.peer.setLocalDescription(new RTCSessionDescription(offer)) //Here we are setting it in local description
            return offer;
        }
    }
}

export default new Peer