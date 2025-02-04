const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

// Use HTTP server with WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();

// Broadcast a message to all clients
function broadcastMessage(message, sender) {
  clients.forEach((client, id) => {
    if (client.readyState === WebSocket.OPEN && id !== sender) {
      client.send(message);
    }
  });
}

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  // Assign a unique ID to the client
  const id = Date.now().toString();
  clients.set(id, ws);

  console.log(`Client connected: ${id}`);
  ws.send(JSON.stringify({ message: `Welcome to the IRC server! Your ID is ${id}` }));

  // Handle incoming messages
  ws.on('message', (data) => {
    console.log(`Received message from ${id}:`, data);
    broadcastMessage(data, id);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log(`Client disconnected: ${id}`);
    clients.delete(id);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`Error on client ${id}:`, error.message);
    clients.delete(id);
  });
});

// HTTP health-check route (optional)
app.get('/health', (req, res) => {
  res.send('WebSocket server is running!');
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`IRC WebSocket server running on port ${PORT}`);
});
