const http = require("http");
const express = require("express");
const { SocketAddress } = require("net");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5500;

const io = require("socket.io")(server);

server.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);

});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname + "/public"));

// Socket.io Setup begins here
var users = {};

io.on("connection", (socket) => {
  console.log("Connected...");
  // console.log(socket.id);
  socket.on("new-user-joined", (username) => {
    users[socket.id] = username;
    // console.log(users);.  
    socket.broadcast.emit("user-connected", username);

    io.emit('user-list', users);
    socket.on('message', (data) => {
      socket.broadcast.emit('message', data);
    });
  });

  socket.on('disconnect', () => {
    user = users[socket.id];
    socket.broadcast.emit('user-disconnected', user);
    delete users[socket.id];
    io.emit('user-list', users);
  });

});
