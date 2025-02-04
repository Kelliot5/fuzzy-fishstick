// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, specify your client URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (data) => {
    const { username, channel } = data;
    socket.join(channel);
    console.log(`${username} joined ${channel}`);
    socket.to(channel).emit('message', { username: 'Server', message: `${username} joined ${channel}` });
  });

  socket.on('message', (data) => {
    const { username, message } = data;
    console.log(`Message from ${username}: ${message}`);
    // Broadcast the message to the #general channel
    io.to("#general").emit('message', { username, message });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server is running on port 3001");
});
