import { Server } from "socket.io";
import env from 'dotenv';

const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false
    }
});

import { DbConnection } from "./Db/dbConnection.js";
env.config();

DbConnection();

const emailToSocketMap = new Map()
const socketIdtoEmailMap = new Map()
io.on('connection', (socket) => {
    console.log(`Socket connected ${socket.id}`)

    socket.on('room:join', (data) => {
        console.log(data)
        const { email, roomId } = data;
        emailToSocketMap.set(email, socket.id)
        socketIdtoEmailMap.set(socket.id, email);
        io.to(socket.id).emit('room:join', data); //Okey so when we get socket.emit('room:join') from Lobby then 
        //“Send an event called room:join to that specific client, with this data.”

        io.to(roomId).emit("user:joined", { email, id: socket.id })
        // so basically jo user have this roomId uske pass ye emit ka message chla jayga 
        // aand "user:joined" pauch jayga

        socket.join(roomId) //Then jouser hoga with that roomId usko hum join kra denge
        
    })

    socket.on('user:call', ({ to, offer }) => {
        io.to(to).emit('incoming:call', { from: socket.id, offer }) 
        //io.to(to) so here this(to) means the rmeoteId 
        //kykoi hum to:remoteId vala user bhaj rhe h
    })

    socket.on('call:accepted', ({ to, ans }) => {
        io.to(to).emit('call:accepted', { from: socket.id, ans })
    })


    socket.on('peer:nego:needed', ({ offer, to }) => {
        //When negotiationneeded fires on one peer, send the new offer to the other peer
        io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
    })

    socket.on('peer:nego:done', ({ to, ans }) => {
        //Second peer sends back answer (ans) to complete negotiation
        io.to(to).emit('peer:nego:final', { from: socket.id, ans })
    })
    // ------------------------------------------------------------------
})
