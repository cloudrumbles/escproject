// models/hotelModel.js
const axios = require('axios');

class HotelModel {
  constructor() {
    this.baseUrl = 'https://hotelapi.loyalty.dev/api';
  }

  async searchHotels(params) {
    try {
      let completed = false;
      let hotels = [];
      
      while (!completed) {
        const response = await axios.get(`${this.baseUrl}/hotels/prices`, { params });
        const data = response.data;
        
        hotels = data.hotels || [];
        completed = data.completed;

        if (!completed) {
          // Wait for a short interval before polling again
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      return hotels;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  }

  async getHotelPrice(hotelId, params) {
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}/price`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching price for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  async getHotelsForDestination(destinationId) {
    try {
      const response = await axios.get(`${this.baseUrl}/hotels`, { params: { destination_id: destinationId } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotels for destination ${destinationId}:`, error);
      throw error;
    }
  }

  async getHotelDetails(hotelId) {
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  formatSearchParams(searchCriteria) {
    return {
      destination_id: 'WD0M',
      checkin: searchCriteria.checkIn,
      checkout: searchCriteria.checkOut,
      lang: searchCriteria.language || 'en_US',
      currency: searchCriteria.currency || 'USD',
      country_code: searchCriteria.countryCode || 'US',
      guests: this.formatGuestsString(searchCriteria.guests),
      partner_id: '1'
    };
  }

  formatGuestsString(guests) {
    if (Array.isArray(guests)) {
      return guests.join('|');
    }
    return guests.toString();
  }

  processHotelImages(hotel) {
    if (hotel.image_details) {
      hotel.images = [];
      for (let i = 1; i <= hotel.image_details.count; i++) {
        hotel.images.push(`${hotel.image_details.prefix}${i}${hotel.image_details.suffix}`);
      }
    }
    return hotel;
  }
}

module.exports = new HotelModel();