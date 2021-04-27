const host = "http://localhost:3000";
// PASS your query parameters
const queryParams = { userID: 123 };
const socket = io(host, {
  path: "/pathToConnection",
  transports: ["websocket"], // https://stackoverflow.com/a/52180905/8987128
  upgrade: false,
  query: queryParams,
  reconnection: false,
  rejectUnauthorized: false,
});

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var nicknameInput = document.getElementById("nicknameInput");
var messageInput = document.getElementById("messageInput");
var typing = document.getElementById("typing");

document.getElementById("host").innerHTML = host;
document.getElementById("userID").innerHTML = queryParams.userID;

socket.once("connect", () => {
  document.getElementById("connection").innerHTML = "connected";

  // USER IS ONLINE
  socket.on("online", (userID) => {
    console.log(userID, "Is Online!"); // update online status
    document.getElementById("logs").innerHTML += "<div>" + userID + " Is Now Online! </div>";
  });

  // USER IS OFFLINE
  socket.on("offline", (userID) => {
    console.log(userID, "Is Offline!"); // update offline status
    document.getElementById("logs").innerHTML += "<div>" + userID + " Is Now Offline! </div>";
  });

  // ==== SUPPORTIVES

  socket.on("connect_error", (err) => {
    document.getElementById("connection").innerHTML = "Connect Error - " + err.message;
    console.log(err.message);
  });
  socket.on("connect_timeout", () => {
    document.getElementById("connection").innerHTML = "Conection Time Out Please Try Again.";
  });
  socket.on("reconnect", (num) => {
    document.getElementById("connection").innerHTML = "Reconnected - " + num;
  });
  socket.on("reconnect_attempt", () => {
    document.getElementById("connection").innerHTML = "Reconnect Attempted.";
  });
  socket.on("reconnecting", (num) => {
    document.getElementById("connection").innerHTML = "Reconnecting - " + num;
  });
  socket.on("reconnect_error", (err) => {
    document.getElementById("connection").innerHTML = "Reconnect Error - " + err.message;
  });
  socket.on("reconnect_failed", () => {
    document.getElementById("connection").innerHTML = "Reconnect Failed";
  });

  // ==== CHAT

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (nicknameInput.value && messageInput.value) {
      socket.emit("chat message", nicknameInput.value || "anonymous", messageInput.value);
      messageInput.value = "";
    }
  });

  socket.on("broadcast", function (data) {
    onlineMembers.innerHTML = data;
  });

  socket.on("chat message", function (nickname, msg) {
    var item = document.createElement("li");
    item.innerHTML = "<p><strong>" + nickname + " : </strong>" + msg + "</p>";
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

    // clear the typing indicator when we receive a message
    typing.innerHTML = "";
  });

  // emit a “typing” event when we start typing
  messageInput.addEventListener("keypress", function () {
    socket.emit("typing", nicknameInput.value);
  });

  // when we receive a typing event, show that a user is typing
  socket.on("typing", function (data) {
    typing.innerHTML = "<p><em>" + data + " is typing</em></p>";
  });
});
