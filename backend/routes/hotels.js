const express = require('express');
const router = express.Router();
const HotelModel = require('../models/HotelModel');

router.get('/test', (req, res) => {
  res.send('Hello World!');
});

router.get('/hotels/search', async (req, res) => {
  try {
    const searchCriteria = {
      destinationId: req.query.destinationId,
      checkIn: req.query.checkIn,
      checkOut: req.query.checkOut,
      guests: req.query.guests,
      language: req.query.language,
      currency: req.query.currency,
      countryCode: req.query.countryCode
    };

    // Validate required parameters
    if (!searchCriteria.destinationId || !searchCriteria.checkIn || !searchCriteria.checkOut || !searchCriteria.guests) {
      return res.status(400).json({ error: 'Missing required search parameters' });
    }

    const formattedParams = HotelModel.formatSearchParams(searchCriteria);
    const hotels = await HotelModel.searchHotels(formattedParams);
    console.log(formattedParams);

    // Process hotel images
    const processedHotels = hotels.map(hotel => HotelModel.processHotelImages(hotel));

    res.json(processedHotels);
  } catch (error) {
    console.error('Error searching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/hotels/:hotelId/price', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const params = HotelModel.formatSearchParams(req.query);
    const priceDetails = await HotelModel.getHotelPrice(hotelId, params);
    res.json(priceDetails);
  } catch (error) {
    console.error(`Error fetching price for hotel ${req.params.hotelId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/hotels/destination/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    const hotels = await HotelModel.getHotelsForDestination(destinationId);
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
    const hotelDetails = await HotelModel.getHotelDetails(hotelId);
    const processedHotel = HotelModel.processHotelImages(hotelDetails);
    res.json(processedHotel);
  } catch (error) {
    console.error(`Error fetching details for hotel ${req.params.hotelId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;