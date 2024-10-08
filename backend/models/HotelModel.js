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
   * Validate search parameters
   * @private
   * @param {Object} params - The parameters to validate
   * @throws {Error} If parameters are invalid
   */
  #validateSearchParams(params) {
    const requiredParams = ['destination_id', 'checkin', 'checkout', 'lang', 'currency', 'country_code', 'guests', 'partner_id'];
    for (const param of requiredParams) {
      if (!params[param]) {
        throw new Error(`Invalid parameters: ${param} is required`);
      }
    }
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
        throw new Error(`API request failed: ${error.message}`);
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
    this.#validateSearchParams(params);
    return this.#pollRequest('/hotels/prices', params, 'hotels');
  }

  /**
   * Get hotels for a specific destination.
   * @async
   * @param {string} destinationId - The ID of the destination.
   * @returns {Promise<Array>} A promise that resolves to an array of hotel objects.
   */
  async fetchHotels(destinationId) {
    if (!destinationId) {
      throw new Error('Invalid parameters: destination_id is required');
    }
    try {
      const response = await axios.get(`${this.baseUrl}/hotels`, { params: { destination_id: destinationId } });
      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error(`No hotels found for destination ID: ${destinationId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotels for destination ${destinationId}:`, error);
      throw new Error(`Failed to fetch hotels: ${error.message}`);
    }
  }

  /**
   * Get details for a specific hotel.
   * @async
   * @param {string} hotelId - The ID of the hotel.
   * @returns {Promise<Object>} A promise that resolves to the hotel details.
   */
  async fetchHotelDetails(hotelId) {
    if (!hotelId) {
      throw new Error('Invalid parameters: hotel ID is required');
    }
    try {
      const response = await axios.get(`${this.baseUrl}/hotels/${hotelId}`);
      if (!response.data || typeof response.data !== 'object' || Object.keys(response.data).length === 0) {
        throw new Error(`No details found for hotel ID: ${hotelId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for hotel ${hotelId}:`, error);
      throw new Error(`Failed to fetch hotel details: ${error.message}`);
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
    if (!hotelId) {
      throw new Error('Invalid parameters: hotel ID is required');
    }
    this.#validateSearchParams(params);
    const rooms = await this.#pollRequest(`/hotels/${hotelId}/price`, params, 'rooms');
    if (rooms.length === 0) {
      throw new Error(`No rooms found for hotel ID: ${hotelId}`);
    }
    return rooms;
  }
}

module.exports = HotelModel;