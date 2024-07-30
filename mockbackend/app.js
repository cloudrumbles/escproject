const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3100;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint 1: Returns the first JSON file
app.get('/api/data1', (req, res) => {
  const filePath = path.join(__dirname, 'data1.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint 2: Fetches hotel data from external API
app.get('/api/data2/:id', async (req, res) => {
  const hotelId = req.params.id;
  const apiUrl = `https://hotelapi.loyalty.dev/api/hotels/${hotelId}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotel data:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ error: 'No response received from hotel API' });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: 'Error setting up the request' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});