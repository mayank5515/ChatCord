const express = require("express");
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const socket = require("socket.io");

dotenv.config({
  path: "./config.env",
});
const app = express();
const server = http.createServer(app); //as express handles server under hood but we need server to pass this to socket.io
const io = socket(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
// eslint-disable-next-line no-shadow
io.on("connection", (socket) => {
  //   console.log("New WS connection....");
  //we want to send or emit messages(or events) back and forth
  //emit message to client from server
  //EMIT MESSAGE TO (ONLY) CLIENT THAT CONNECTS
  socket.emit("message", "Welcome to ChatCord");

  //BROADCAST WHEN A USER CONNECTS (ONLY USER WONT BE BROADCASTED TO)
  socket.broadcast.emit("message", "A user has joined the chat");

  //RUN WHEN USER DISCONNECTS
  socket.on("disconnect", () => {
    //BROADCAST TO EVERYONE
    io.emit("message", "A user has left the chat");
  });

  //LISTEN TO CHAT MESSAGE
  socket.on("chatMessage", (message) => {
    //EMIT THIS MESSAGE BACK TO CLIENT (WHY? WELL U WANNA SEE YOUR OWN MESSAGE RIGHT ? AND EVERYONE SHOULD SEE IT TOO)
    //ARE WE BROADCASTING IT
    io.emit("message", message);
    // console.log("from server", message);
  });
});
const port = 4000 || process.env.PORT;
server.listen(port, () => {
  console.log(`Listening to server on port ${port}`);
});
