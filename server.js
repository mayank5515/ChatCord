const express = require("express");
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const socket = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/user");

dotenv.config({
  path: "./config.env",
});
const botName = "ChatCord Bot";
const app = express();
const server = http.createServer(app); //as express handles server under hood but we need server to pass this to socket.io
const io = socket(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//RUN WHEN CLIENT CONNECTS
// eslint-disable-next-line no-shadow
io.on("connection", (socket) => {
  //
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    //JOIN ROOM
    socket.join(user.room);

    //console.log("New WS connection....");
    //we want to send or emit messages(or events) back and forth ,emit message to client from server
    //EMIT MESSAGE TO (ONLY) CLIENT THAT CONNECTS
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));
    //BROADCAST WHEN A USER CONNECTS (ONLY USER WONT BE BROADCASTED TO)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );
    //SEND USERS AND ROOM INFO
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //LISTEN TO CHAT MESSAGE FROM CLIENT
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    //EMIT THIS MESSAGE BACK TO CLIENT (WHY? WELL U WANNA SEE YOUR OWN MESSAGE RIGHT ? AND EVERYONE SHOULD SEE IT TOO)
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  //RUN WHEN USER DISCONNECTS
  socket.on("disconnect", () => {
    //GET THAT USER THAT HAS LEFT THE CHAT
    const user = userLeave(socket.id);
    // console.log(user);
    //BROADCAST TO EVERYONE (IN THAT ROOM)
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, ` ${user.username} has left the chat`)
      );

      //SEND USERS AND ROOM INFO
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//LISTENING TO SERVER
const port = 4000 || process.env.PORT;
server.listen(port, () => {
  console.log(`Listening to server on port ${port}`);
});

//socket.id is a unique identifier for each socket connection. When a client connects to the server, Socket.IO assigns a unique ID to that connection.
//socket.join is used to join a socket (client connection) to a specific room. Rooms in Socket.IO allow you to group sockets together, making it easier to manage and broadcast messages to specific subsets of connected clients
