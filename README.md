# Nodematrix Backend

This is the backend API for the Nodematrix Terminal RPG game. It supports saving and loading game data, MetaMask authentication, and serves as the IRC/WebSocket server for real-time features.

## Features

- **REST API Endpoints:**  
  - `POST /api/save`: Save game data (with MetaMask signature verification).
  - `GET /api/load/:userId`: Load game data by user ID.

- **MetaMask Authentication:**  
  Uses MetaMask to sign messages and verify that game data requests come from the correct user.

- **Real-Time Communication:**  
  Supports WebSocket connections for IRC/chat functionalities.

## Prerequisites

- Node.js (version 14 or above)
- npm

## Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/nodematrix-backend.git
   cd nodematrix-backend
