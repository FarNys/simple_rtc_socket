// server.mjs
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Enable CORS for REST API
app.use(cors());

// Basic test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins (change for production!)
    methods: ["GET", "POST"],
  },
});

let usersList = [];

// Socket.IO handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  usersList.push({
    joinedAt: new Date(),
    socketId: socket.id,
  });

  socket.emit("users", usersList);
  socket.join("all-users");
  socket.to("all-users").emit("new-user", usersList);

  socket.on("disconnect", () => {
    socket.leave("all-users");
    const onlineUsers = usersList.filter((user) => user.socketId !== socket.id);
    usersList = onlineUsers;
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
