/* eslint-disable no-undef */
const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//OUTPUT MESSAGE TO DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">${message}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//catching the message/event on client side emitted from server
socket.on("message", (message) => {
  console.log("from client", message);
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
