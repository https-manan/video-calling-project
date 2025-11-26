import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../contextAPI/socketContext';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {

  const navigate = useNavigate();
  const socket = useSocket();
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');

  const submitHandler = useCallback(() => {//Here we are sending data to BE
    socket.emit('room:join', { email, roomId });
  }, [email, roomId]);

  const handleJoinRoom = useCallback((data) => {
    const { roomId } = data; //getting res form BE
    navigate(`/room/${roomId}`);
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;
    socket.on("room:join", handleJoinRoom);
    return () => socket.off("room:join", handleJoinRoom);
  }, [socket, handleJoinRoom]);


  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Join a Room
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-300">Email</label>
            <input 
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="roomid" className="text-sm text-gray-300">Room ID</label>
            <input 
              type="text"
              id="roomid"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-white"
            />
          </div>

          <button
            onClick={submitHandler}
            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md transition"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}

export default Lobby;
