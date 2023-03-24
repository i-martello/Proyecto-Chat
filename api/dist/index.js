"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(server_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
io.on("connection", (socket) => {
    console.log("conectado a socket.io");
    socket.on("message", (object) => {
        console.log(socket.handshake.headers);
        console.log(object);
        socket.broadcast.emit('message', {
            body: object.message,
            from: object.user
        });
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("funcando");
});
