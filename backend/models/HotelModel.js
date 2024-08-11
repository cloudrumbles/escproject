/**
 * @module HotelModel
 * @requires axios
 */

const axios = require('axios');

/**
 * Represents a model for interacting with a hotel API.
 * @class
 */
class HotelModel {
  /**
   * Create a HotelModel.
   * @constructor
   */
  constructor() {
    /**
     * The base URL for the hotel API.
     * @type {string}
     */
    this.baseUrl = 'https://hotelapi.loyalty.dev/api';
  }

  /**
   * Search for hotels based on given parameters.
   * @async
   * @param {Object} params - The search parameters.
   * @returns {Promise<Array>} A promise that resolves to an array of hotel objects.
   * @throws {Error} If there's an error during the API request or if the response is invalid.
   */
  async fetchPrices(params) {
    try {
      let completed = false;
      let hotels = [];

      
      while (!completed) {
        const response = await axios.get(`${this.baseUrl}/hotels/prices`, { params });
        const data = response.data;
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response from API');
        }
        
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

  /**
   * Get the price for a specific hotel.
   * @async
   * @param {string} hotelId - The ID of the hotel.
   * @param {Object} params - Additional parameters for the request.
   * @returns {Promise<Object>} A promise that resolves to the hotel price data.
   * @throws {Error} If there's an error during the API request or if the response is invalid.
   */
  async getHotelPrice(hotelId, params) {
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}/price`, { params });
      if (!response.data || typeof response.data !== 'object' || !Array.isArray(response.data.rooms)) {
        throw new Error(`Invalid response for hotel ID: ${hotelId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching price for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  /**
   * Get hotels for a specific destination.
   * @async
   * @param {string} destinationId - The ID of the destination.
   * @returns {Promise<Array>} A promise that resolves to an array of hotel objects.
   * @throws {Error} If there's an error during the API request or if the response is invalid.
   */
  async fetchHotels(destinationId) {
    try {
      const response = await axios.get(`${this.baseUrl}/hotels`, { params: { destination_id: destinationId } });
      if (!Array.isArray(response.data)) {
        throw new Error(`Invalid response for destination ID: ${destinationId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotels for destination ${destinationId}:`, error);
      throw error;
    }
  }

  /**
   * Get details for a specific hotel.
   * @async
   * @param {string} hotelId - The ID of the hotel.
   * @returns {Promise<Object>} A promise that resolves to the hotel details.
   * @throws {Error} If there's an error during the API request or if the response is invalid.
   */
  async getHotelDetails(hotelId) {
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}`);
      if (!response.data || typeof response.data !== 'object') {
        throw new Error(`Invalid response for hotel ID: ${hotelId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  /**
   * Format search parameters for API requests.
   * @param {Object} searchCriteria - The search criteria object.
   * @param {string} searchCriteria.destinationId - The destination ID.
   * @param {string} searchCriteria.checkIn - The check-in date.
   * @param {string} searchCriteria.checkOut - The check-out date.
   * @param {string} [searchCriteria.language='en_US'] - The language for results.
   * @param {string} [searchCriteria.currency='USD'] - The currency for prices.
   * @param {string} [searchCriteria.countryCode='US'] - The country code.
   * @param {Array|string} searchCriteria.guests - The guest information.
   * @returns {Object} Formatted search parameters.
   */
  formatSearchParams(searchCriteria) {
    return {
      destination_id: searchCriteria.destinationId,
      checkin: searchCriteria.checkIn,
      checkout: searchCriteria.checkOut,
      lang: searchCriteria.language || 'en_US',
      currency: searchCriteria.currency || 'USD',
      country_code: searchCriteria.countryCode || 'US',
      guests: this.formatGuestsString(searchCriteria.guests),
      partner_id: '1'
    };
  }

  /**
   * Format guests information into a string.
   * @param {Array|string} guests - The guest information.
   * @returns {string} Formatted guests string.
   */
  formatGuestsString(guests) {
    if (Array.isArray(guests)) {
      return guests.join('|');
    }
    return guests.toString();
  }

  /**
   * Process hotel images and add them to the hotel object.
   * @param {Object} hotel - The hotel object.
   * @returns {Object} The hotel object with processed images.
   */
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

module.exports = HotelModel;