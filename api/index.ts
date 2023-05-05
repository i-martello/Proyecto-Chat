import express from "express";
import app from "./server";
import { Server as SocketServer } from "socket.io";
import http from "http";
import chatModel from "./models/chat.model";

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("conectado a socket.io");

  socket.on("message", async (object) => {
    // Guardar el mensaje en la base de datos de manera asincrónica
    await new chatModel({ message: object.message, user: object.user }).save();
    // Obtener todos los mensajes de la base de datos
    const mensajes = await chatModel.find().sort({ createdAt: -1 });
    // Emitir el mensaje a todos los clientes conectados
    io.emit("message", mensajes);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("funcando");
});
