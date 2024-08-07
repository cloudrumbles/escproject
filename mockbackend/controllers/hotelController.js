// controllers/hotelController.js

const HotelModel = require('../models/HotelModel');

class HotelController {
  async searchHotels(req, res) {
    try {
      const searchParams = HotelModel.formatSearchParams(req.query);
      const hotels = await HotelModel.searchHotels(searchParams);
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for hotels' });
    }
  }

  async getHotelDetails(req, res) {
    try {
      const hotelId = req.params.id;
      const details = await HotelModel.getHotelDetails(hotelId);
      const processedDetails = HotelModel.processHotelImages(details);
      res.json(processedDetails);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching hotel details' });
    }
  }

  async getHotelPrice(req, res) {
    try {
      const hotelId = req.params.id;
      const searchParams = HotelModel.formatSearchParams(req.query);
      const price = await HotelModel.getHotelPrice(hotelId, searchParams);
      
      if (price.rooms && price.rooms.length === 0) {
        return res.status(404).json({ error: 'No rooms available for this hotel' });
      }
      
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching hotel price' });
    }
  }
}

module.exports = new HotelController();