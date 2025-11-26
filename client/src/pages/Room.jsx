import { useSocket } from "../contextAPI/socketContext"
import { useCallback, useEffect, useState, useRef } from "react"
import peer from "../service/peer"

const Room = () => {
  const socket = useSocket()
  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [myStream, setMyStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)

  const myVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const callhandler = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }) //basically yha hum user se ascess le rhe h audio and video ka 

    const offer = await peer.getOffer() // MUST await
    socket.emit('user:call', { to: remoteSocketId, offer }) 
    //So the user which is connected/joined the room usko phale setRemoteId me kra tha 
    //to usko offer bhaj rhe h so ({to:remoteIdUser,offer})

    setMyStream(stream)
  }, [remoteSocketId, socket])

  const handelUserJoined = useCallback(({ id }) => {
    setRemoteSocketId(id)
  }, [])

  const handleInCommingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from)

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }) //again user se access le rhe h

    setMyStream(stream)

    const ans = await peer.getAnswer(offer)
    socket.emit('call:accepted', { to: from, ans })
  }, [socket])

  const handelCallAccepted = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans)

    //Adding local tracks to RTCPeerConnection
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream)
    }
  }, [myStream])

  const handelNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer() // must be awaited
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId })
  }, [remoteSocketId, socket])

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handelNegotiationNeeded)
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handelNegotiationNeeded)
    }
  }, [handelNegotiationNeeded])

  useEffect(() => {
    socket.on('user:joined', handelUserJoined)
    socket.on('incoming:call', handleInCommingCall)
    socket.on('call:accepted', handelCallAccepted)

    return () => {
      socket.off('user:joined', handelUserJoined)
      socket.off('incoming:call', handleInCommingCall)
      socket.off('call:accepted', handelCallAccepted)
    }
  }, [socket, handelUserJoined, handleInCommingCall, handelCallAccepted])

  useEffect(() => {
    peer.peer.addEventListener('track', async (events) => {
      const remoteStream = events.streams[0] // FIX: events.streams is array
      setRemoteStream(remoteStream)
    })
  }, [])

  useEffect(() => {
    if (myStream && myVideoRef.current) {
      myVideoRef.current.srcObject = myStream
    }
  }, [myStream])

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 gap-6">

      <h1 className="text-2xl font-semibold">
        {remoteSocketId ? "Another user joined" : "No one in this room"}
      </h1>

      {remoteSocketId && (
        <button
          onClick={callhandler}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition"
        >
          Call
        </button>
      )}

      <div className="w-[400px] h-[250px] bg-black rounded-xl shadow-xl flex items-center justify-center overflow-hidden">
        <video
          ref={myVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {remoteStream && (
        <div className="w-[400px] h-[250px] bg-black rounded-xl shadow-xl flex items-center justify-center overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  )
}

export default Room
