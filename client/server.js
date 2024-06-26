import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer,{
    pingTimeout: 60000
  });

  io.on("connection", (socket) => {

    socket.on("setup", (userData) => {
   //   console.log(userData)
      socket.join(userData.userId)
      socket.emit("connected")
    })

    socket.on("join chat", (room) => {
      socket.join(room);
    //  console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => {
     // console.log(room);
      socket.in(room).emit("typing")
    });
    socket.on("stop typing", (room) => {
    //  console.log(room)
      socket.in(room).emit("stop typing")
    });

    socket.on('sendMessage', (message) => {
      const chat = message.chat;
      if(!chat || !chat.participants) {
        return console.log("chat.participants are not defined")
      }
     // console.log(message)
      chat.participants.forEach((participant) => {
        if(participant == message.sender._id) return
        socket.in(participant).emit("receiveMessage",message) 
        
      })
       // io.emit('receiveMessage', message);
      });
    
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});