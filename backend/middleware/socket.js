import {Server} from "socket.io";

let SocketCommenti;

const initSocket = (server) => {
        SocketCommenti = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
            }
        });   

    SocketCommenti.on("connection", (socket) => {
        socket.on("ingresso_pagina", (postId) => {
            socket.join(postId);
        });
        socket.on("uscita_pagina", (postId) => {
            socket.leave(postId);
        });

        return SocketCommenti
    });
}

const socketMiddlewere = (req, res, next) => {
    req.SocketCommenti = SocketCommenti
    next() 
} ;

export { initSocket, socketMiddlewere }
