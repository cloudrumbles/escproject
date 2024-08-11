const express = require('express');
const router = express.Router();
const HotelController = require('../controllers/HotelController');

const hotelController = new HotelController();

router.get('/test', (req, res) => {
  res.send('Hello World!');
});

router.get('/hotels/search', async (req, res) => {
  try {
    const queryParams = {
      destination_id: req.query.destination_id,
      checkin: req.query.checkin,
      checkout: req.query.checkout,
      guests: req.query.guests,
      lang: req.query.language || 'en_US',
      currency: req.query.currency || 'SGD',
      country_code: req.query.country_code || 'SG',
      partner_id: 1 // Assuming this is a constant value
    };
    
    console.log('Searching hotels with query params:', queryParams);
    // Validate required parameters
    if (!queryParams.destination_id || !queryParams.checkin || !queryParams.checkout || !queryParams.guests) {
      return res.status(400).json({ error: 'Missing required search parameters' });
    }

    const hotelListings = await hotelController.createHotelListings(queryParams);

    res.json(hotelListings);
  } catch (error) {
    console.error('Error searching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/hotels/:destination_id', async (req, res) => {
  try {
    const { destination_id } = req.params;
    const hotels = await hotelController.getDetails(destination_id);
    res.json(hotels);
    console.log(hotels);
  } catch (error) {
    console.error(`Error fetching hotels for destination ${req.params.destination_id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;