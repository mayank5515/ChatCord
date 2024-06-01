/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
//OUTPUT ROOMNAME TO DOM
function outputRoomName(room) {
  console.log(room);
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}

//GET ROOM AND USERS
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//GET USERNAME AND ROOM FROM QUERY STRING
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//JOIN CHAT ROOM
socket.emit("joinRoom", { username, room }); //THIS WILL WORK AS SOON AS SOMEONE CONNECTS AND WE ARE SENDING PAYLOAD BACK

//OUTPUT MESSAGE TO DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//catching the message/event on client side emitted from server
socket.on("message", (message) => {
  // console.log("from client", message, " also", username, room);
  outputMessage(message);

  //SCROLL TO BOTTOM
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//HANDLE MESSAGE SUBMITION
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //GET MESSAGE TEXT
  const msg = e.target.elements.msg.value;
  //   console.log(msg);
  //EMIT CHAT MESSAGE TO SERVER (AND SEND MSG AS PAYLOAD)
  socket.emit("chatMessage", msg);

  //CLEAR INPUT
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
