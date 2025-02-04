// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();

// Enable CORS so your terminal game can access the API from a different domain.
app.use(cors());
// Parse JSON bodies.
app.use(bodyParser.json());

// For demo purposes, we're using an in-memory object to store game data.
// In a production environment, you should use a proper database (e.g., PostgreSQL).
let savedGameData = {};

// -------------------- SAVE GAME DATA ENDPOINT --------------------
// POST /api/save
// Expected body: {
//   "userId": "someUniqueIdentifier",
//   "metamaskAccount": "0xWalletAddress",
//   "gameData": { ... },
//   "message": "IdleRPG Save Request: <timestamp>",
//   "signature": "signedMessage"
// }
app.post('/api/save', async (req, res) => {
  const { userId, metamaskAccount, gameData, message, signature } = req.body;
  
  // Basic validation: ensure all required fields are provided.
  if (!userId || !metamaskAccount || !gameData || !message || !signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Verify the signature using ethers.js.
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    
    // Check if the recovered address matches the provided metamaskAccount.
    if (recoveredAddress.toLowerCase() !== metamaskAccount.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }
    
    // Save the game data in memory (or in a database for production).
    savedGameData[userId] = { metamaskAccount, gameData };
    
    res.json({ message: 'Game data saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error processing signature: ' + error.message });
  }
});

// -------------------- LOAD GAME DATA ENDPOINT --------------------
// GET /api/load/:userId
// Retrieves game data for a given userId.
app.get('/api/load/:userId', (req, res) => {
  const userId = req.params.userId;
  
  if (!savedGameData[userId]) {
    return res.status(404).json({ error: 'No game data found.' });
  }
  
  res.json({ gameData: savedGameData[userId].gameData });
});

// -------------------- SERVER STARTUP --------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
