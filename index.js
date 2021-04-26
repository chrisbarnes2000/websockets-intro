const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("Yay, connection with " + socket.id + " was recorded");
  socket.broadcast.emit("chat message", "server", "some user connected");

  socket.on("chat message", (nickname, msg) => {
    io.emit("chat message", nickname, msg);
    console.log("message: " + nickname, msg);
  });

  socket.on("disconnect", function () {
    socket.broadcast.emit("chat message", "server", "some user disconnected");
    console.log("Oh No, someone disconnected");
  });

  socket.on("typing", function (data) {
    // send an event to everyone but the person who emitted the typing event to the server
    socket.broadcast.emit("typing", data);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
