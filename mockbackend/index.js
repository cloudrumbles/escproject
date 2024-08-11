// src/index.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
// Import the routes file directly
// Adjust the path if your routes file is named differently or located elsewhere

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Serve static files from the current directory
app.use(express.static(__dirname));


// Serve combined_data.json
app.get('/combined_data.json', (req, res) => {
  res.sendFile(join(__dirname, 'combined_data.json'));
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));