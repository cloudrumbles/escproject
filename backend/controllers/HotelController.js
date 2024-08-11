const HotelModel = require('../models/HotelModel');

class HotelController {
  constructor() {
      this.hotelModel = new HotelModel();
  }

  async getDetails(hotelId) {
    return await this.hotelModel.fetchHotelDetails(hotelId);
  }

  async getHotels(destination_id) {
      return await this.hotelModel.fetchHotels(destination_id);
  }

  async getPrices(params) {
      return await this.hotelModel.fetchPrices(params);
  }

  async getRooms(hotelId, params) {
      return await this.hotelModel.fetchRooms(hotelId, params);
  }

  retrieveListingDetails(data, hotelId) {
      const hotel = data.find(hotel => hotel.id === hotelId);
      if (!hotel) return null;

      return {
          id: hotel.id,
          name: hotel.name,
          address: hotel.address,
          starRating: hotel.rating,
          guestRating: hotel.trustyou.score.overall,
          imageUrl: `${hotel.image_details.prefix}${hotel.default_image_index}${hotel.image_details.suffix}`
      };
  }

  async createHotelListings(params) {
    const hotels = await this.getHotels(params.destination_id);
    const prices = await this.getPrices(params);

    return prices.reduce((acc, price) => {
        const details = this.retrieveListingDetails(hotels, price.id);
        if (details) {
            acc.push({
                id: price.id,
                name: details.name,
                address: details.address,
                price: price.converted_price,
                imageUrl: details.imageUrl,
                starRating: details.starRating,
                guestRating: details.guestRating
            });
        }
        return acc;
    }, []);
  }

}

module.exports = HotelController;