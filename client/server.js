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

  const io = new Server(httpServer);

  io.on("connection", (socket) => {

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
      let chat = message.chat;

      if(!chat.participants) {
        return console.log("chat.participants are not defined")
      }

      chat.participants.forEach((participant) => {
        socket.in(participant._id).emit("receiveMessage",message)
        
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