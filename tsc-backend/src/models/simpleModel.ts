import axios, { AxiosInstance } from 'axios';
import { HotelAPIResponse, HotelPrices, HotelPricesResult, QueryParams, RoomResponse } from '../types';
import config from '../config';
import logger from '../logger';

/**
 * HotelModel class for handling hotel-related API requests.
 * This class uses the Singleton pattern and implements polling for all API calls.
 */
class HotelModel {
  private static instance: HotelModel;
  private readonly api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
    });
  }

  /**
   * Gets the singleton instance of HotelModel.
   * @returns {HotelModel} The HotelModel instance.
   */
  public static getInstance(): HotelModel {
    if (!HotelModel.instance) {
      HotelModel.instance = new HotelModel();
    }
    return HotelModel.instance;
  }

  /**
   * Fetches hotels for a given destination.
   * @param {string} destinationId - The ID of the destination.
   * @returns {Promise<HotelAPIResponse[]>} A promise that resolves to an array of hotel responses.
   */
  public async fetchHotels(destinationId: string): Promise<HotelAPIResponse[]> {
    return this.fetchData<HotelAPIResponse[]>('/hotels', { destination_id: destinationId });
  }

  /**
   * Fetches hotel prices based on the provided query parameters.
   * @param {QueryParams} params - The query parameters for fetching hotel prices.
   * @returns {Promise<HotelPrices[]>} A promise that resolves to an array of hotel prices.
   */
  public async fetchHotelPrices(params: QueryParams): Promise<HotelPrices[]> {
    const result = await this.fetchData<HotelPricesResult>('/hotels/prices', params);
    return result.hotels;
  }

  /**
   * Fetches details for a specific hotel.
   * @param {string} hotelId - The ID of the hotel.
   * @returns {Promise<HotelAPIResponse>} A promise that resolves to the hotel details.
   */
  public async fetchHotelDetails(hotelId: string): Promise<HotelAPIResponse> {
    return this.fetchData<HotelAPIResponse>(`/hotels/${hotelId}`);
  }

  /**
   * Fetches room information for a specific hotel.
   * @param {string} hotelId - The ID of the hotel.
   * @param {QueryParams} params - The query parameters for fetching room information.
   * @returns {Promise<RoomResponse>} A promise that resolves to the room response.
   */
  public async fetchRooms(hotelId: string, params: QueryParams): Promise<RoomResponse> {
    return this.fetchData<RoomResponse>(`/hotels/${hotelId}/price`, params);
  }

  /**
   * Generic method to fetch data from the API with polling.
   * @param {string} endpoint - The API endpoint to call.
   * @param {QueryParams | Record<string, any>} [params] - Optional query parameters.
   * @returns {Promise<T>} A promise that resolves to the API response data.
   * @throws {Error} If the API call fails after maximum retries.
   * @private
   */
  private async fetchData<T>(endpoint: string, params?: QueryParams | Record<string, any>): Promise<T> {
    let attempts = 0;
    while (true) {
      try {
        const response = await this.api.get(endpoint, { params });
        const { data, completed } = response.data;

        if (completed) {
          return data;
        }

        await this.delay(config.API_POLL_INTERVAL);
        attempts++;
      } catch (error) {
        logger.error(`API call failed (attempt ${attempts + 1}):`, error);
        if (attempts >= config.MAX_API_RETRIES) {
          throw new Error(`API call failed after ${attempts} attempts`);
        }
        await this.delay(config.API_RETRY_DELAY);
        attempts++;
      }
    }
  }

  /**
   * Creates a delay using a Promise.
   * @param {number} ms - The number of milliseconds to delay.
   * @returns {Promise<void>} A promise that resolves after the specified delay.
   * @private
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default HotelModel;