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
   * @param {string} baseUrl - The base URL for the hotel API.
   */
  constructor(baseUrl = 'https://hotelapi.loyalty.dev/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic method to handle API requests with polling.
   * @async
   * @private
   * @param {string} endpoint - The API endpoint.
   * @param {Object} params - The request parameters.
   * @param {string} dataField - The field in the response containing the desired data.
   * @returns {Promise<Array>} A promise that resolves to an array of objects.
   * @throws {Error} If there's an error during the API request or if the response is invalid.
   */
  async #pollRequest(endpoint, params, dataField) {
    let completed = false;
    let results = [];

    while (!completed) {
      try {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, { params });
        const data = response.data;

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response from API');
        }

        results = data[dataField] || [];
        completed = data.completed;

        if (!completed) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Error in API request to ${endpoint}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Search for hotels based on given parameters.
   * @async
   * @param {Object} params - The search parameters.
   * @returns {Promise<Array>} A promise that resolves to an array of hotel objects.
   */
  async fetchPrices(params) {
    return this.#pollRequest('/hotels/prices', params, 'hotels');
  }

  /**
   * Get hotels for a specific destination.
   * @async
   * @param {string} destinationId - The ID of the destination.
   * @returns {Promise<Array>} A promise that resolves to an array of hotel objects.
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
   */
  async fetchHotelDetails(hotelId) {
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
   * Get rooms for a specific hotel.
   * @async
   * @param {string} hotelId - The ID of the hotel.
   * @param {Object} params - The request parameters.
   * @returns {Promise<Array>} A promise that resolves to an array of room objects.
   */
  async fetchRooms(hotelId, params) {
    return this.#pollRequest(`/hotels/${hotelId}/price`, params, 'rooms');
  }
}

module.exports = HotelModel;