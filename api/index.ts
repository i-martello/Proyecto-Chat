import express from 'express'
import app from './server'
import { Server as SocketServer } from 'socket.io'
import http from 'http'

const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
})

io.on("connection",(socket)=>{  
  console.log("conectado a socket.io")
    socket.on("message", (object)=>{
      console.log(socket.handshake.headers);
      console.log(object)
    socket.broadcast.emit('message', {
      body: object.message,
      from: object.user
    })
  })
})


const PORT = process.env.PORT || 5000

server.listen(PORT, ()=>{
  console.log("funcando")
})