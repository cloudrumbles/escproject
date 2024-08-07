const express = require('express');
const router = express.Router();
const HotelModel = require('../models/HotelModel');
const HotelController = require('../controllers/HotelController');

const hotelController = new HotelController();

router.get('/test', (req, res) => {
  res.send('Hello World!');
});

router.get('/hotels/search', async (req, res) => {
  try {
    const queryParams = {
      destination_id: req.query.destinationId,
      checkIn: req.query.checkIn,
      checkOut: req.query.checkOut,
      guests: req.query.guests,
      lang: req.query.language || 'en_US',
      currency: req.query.currency || 'SGD',
      country_code: req.query.countryCode || 'SG',
      partner_id: 1 // Assuming this is a constant value
    };
    
    console.log('Searching hotels with query params:', queryParams);
    // Validate required parameters
    if (!queryParams.destination_id || !queryParams.checkIn || !queryParams.checkOut || !queryParams.guests) {
      return res.status(400).json({ error: 'Missing required search parameters' });
    }

    const hotelListings = await hotelController.getHotelListings(queryParams);

    res.json(hotelListings);
  } catch (error) {
    console.error('Error searching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/hotels/:hotelId/price', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const params = hotelModel.formatSearchParams(req.query);
    const priceDetails = await hotelModel.getHotelPrice(hotelId, params);
    res.json(priceDetails);
  } catch (error) {
    console.error(`Error fetching price for hotel ${req.params.hotelId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/hotels/destination/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    const hotels = await hotelModel.getHotelsForDestination(destinationId);
    res.json(hotels);
  } catch (error) {
    console.error(`Error fetching hotels for destination ${req.params.destinationId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/hotels/:hotelId', async (req, res) => {
  try {
    console.log('Fetching details for hotel:', req.params.hotelId);
    const { hotelId } = req.params;
    const hotelDetails = await hotelModel.getHotelDetails(hotelId);
    const processedHotel = hotelModel.processHotelImages(hotelDetails);
    res.json(processedHotel);
  } catch (error) {
    console.error(`Error fetching details for hotel ${req.params.hotelId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;