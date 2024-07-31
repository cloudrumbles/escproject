const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3100;

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const DATA_FILE_PATH = path.join(__dirname, 'data1.json');
const HOTEL_API_BASE_URL = 'https://hotelapi.loyalty.dev/api/hotels';

// Helper functions
const readJsonFile = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const generateRandomPrice = () => Math.floor(Math.random() * (300 - 50 + 1)) + 50;

const mapHotelToCard = (hotel) => ({
  id: hotel.id,
  name: hotel.name,
  address: hotel.address,
  starRating: hotel.rating,
  guestRating: parseFloat(hotel.trustyou.score.kaligo_overall),
  price: generateRandomPrice(),
  imageUrl: `${hotel.image_details.prefix}${hotel.default_image_index}${hotel.image_details.suffix}`
});

// Routes
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await readJsonFile(DATA_FILE_PATH);
    const hotelCards = hotels.map(mapHotelToCard);
    res.json(hotelCards);
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/data2/:id', async (req, res) => {
  const { id: hotelId } = req.params;
  const apiUrl = `${HOTEL_API_BASE_URL}/${hotelId}`;

  try {
    const { data } = await axios.get(apiUrl);
    res.json(data);
  } catch (error) {
    console.error('Error fetching hotel data:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(500).json({ error: 'No response received from hotel API' });
    } else {
      res.status(500).json({ error: 'Error setting up the request' });
    }
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;