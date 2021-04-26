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
  console.log("Yay, connection was recorded");
  socket.broadcast.emit("chat message", "some user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log("message: " + msg);
  });

  socket.on("disconnect", function () {
    socket.broadcast.emit("chat message", "some user disconnected");
    console.log("Oh No, someone disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
