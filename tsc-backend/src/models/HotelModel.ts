// HotelModel.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HotelAPIResponse, HotelPrices, QueryParams, Room, RoomResponse } from '../types';
import config from '../config';
import logger from '../logger';

class HotelApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'HotelApiError';
  }
}

class HotelModel {
  private readonly api: AxiosInstance;
  private static instance: HotelModel;

  private constructor() {
    this.api = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
    });
    logger.info('HotelModel instance created');
  }

  public static getInstance(): HotelModel {
    if (!HotelModel.instance) {
      HotelModel.instance = new HotelModel();
    }
    return HotelModel.instance;
  }

  public async fetchHotels(destinationId: string): Promise<HotelAPIResponse[]> {
    logger.info('Fetching hotels', { destinationId });
    const hotels = await this.makeApiCall<HotelAPIResponse[]>('/hotels', { destination_id: destinationId });
    if (hotels.length === 0) {
      throw new HotelApiError(`No hotels found for destination: ${destinationId}`);
    }
    return hotels;
  }

  public async fetchHotelPrices(params: QueryParams): Promise<HotelPrices[]> {
    logger.info('Fetching hotel prices', { params });
    return this.pollApi<HotelPrices[]>('/hotels/prices', params);
  }

  public async fetchHotelDetails(hotelId: string): Promise<HotelAPIResponse> {
    logger.info('Fetching hotel details', { hotelId });
    const details = await this.makeApiCall<HotelAPIResponse>(`/hotels/${hotelId}`);
    if (Object.keys(details).length === 0) {
      throw new HotelApiError(`No details found for hotel: ${hotelId}`);
    }
    return details;
  }

  public async fetchRooms(hotelId: string, params: QueryParams): Promise<RoomResponse> {
    try {
      let completed = false;
      let rooms: Room[] = [];
      let retries = 0;
      const maxRetries = 5;
  
      while (!completed && retries < maxRetries) {
        const response: AxiosResponse<RoomResponse> = await this.api.get(`/hotels/${hotelId}/price`, { params });
        
        const { rooms: fetchedRooms, completed: isCompleted, currency } = response.data;
        
        rooms = rooms.concat(fetchedRooms || []);
        completed = isCompleted;
  
        if (!completed) {
          await this.delay(config.API_POLL_INTERVAL);
          retries++;
        }
      }
  
      if (!completed) {
        throw new HotelApiError(`API polling timed out after ${maxRetries} retries`);
      }
  
      if (rooms.length === 0) {
        throw new HotelApiError(`No rooms found for hotel: ${hotelId}`);
      }
  
      return {
        searchCompleted: true,
        completed: true,
        status: 'success',
        currency: params.currency,
        rooms: rooms
      };
    } catch (error) {
      logger.error('Error fetching rooms:', error);
      if (error instanceof HotelApiError) {
        throw error;
      }
      throw new HotelApiError('Failed to fetch rooms', (error as any).response?.status);
    }
  }


  /**
   * Formats search criteria into QueryParams.
   * @param {{
   *   destinationId: string,
   *   checkIn: string,
   *   checkOut: string,
   *   language?: string,
   *   currency?: string,
   *   countryCode?: string,
   *   guests: number | number[]
   * }} searchCriteria - The search criteria to format.
   * @returns {QueryParams} The formatted query parameters.
   */
  public formatSearchParams(searchCriteria: {
    destinationId: string;
    checkIn: string;
    checkOut: string;
    language?: string;
    currency?: string;
    countryCode?: string;
    guests: number | number[];
  }): QueryParams {
    return {
      destination_id: searchCriteria.destinationId,
      checkin: searchCriteria.checkIn,
      checkout: searchCriteria.checkOut,
      lang: searchCriteria.language || 'en_US',
      currency: searchCriteria.currency || 'USD',
      country_code: searchCriteria.countryCode || 'US',
      guests: this.formatGuestsString(searchCriteria.guests),
      partner_id: 1
    };
  }

  /**
   * Formats the guests parameter into a string.
   * @param {number | number[]} guests - The number of guests or an array of guest counts.
   * @returns {string} A formatted string representing the guests.
   * @private
   */
  private formatGuestsString(guests: number | number[]): string {
    return Array.isArray(guests) ? guests.join('|') : guests.toString();
  }

  /**
   * Makes an API call to the specified endpoint.
   * @param {string} endpoint - The API endpoint to call.
   * @param {QueryParams} [params] - Optional query parameters.
   * @returns {Promise<T>} A promise that resolves to the API response data.
   * @throws {HotelApiError} If there's an error making the API call.
   * @private
   */
  private async makeApiCall<T>(endpoint: string, params?: QueryParams | any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint, { params });
      logger.debug('API call successful', { endpoint, params });
      return response.data;
    } catch (error) {
      this.handleError(`Error fetching data from ${endpoint}:`, error);
    }
  }

  private async pollApi<T>(endpoint: string, params: QueryParams): Promise<T> {
    let completed = false;
    let result: any = [];
    let retries = 0;
    const maxRetries = 5;
  
    while (!completed && retries < maxRetries) {
      const response: AxiosResponse<{ data: any, completed: boolean }> = 
        await this.api.get(endpoint, { params });
      
      const { data, completed: isCompleted } = response.data;
      
      result = result.concat(data || []);
      completed = isCompleted;
  
      if (!completed) {
        logger.debug('Polling API, not yet completed', { endpoint, params });
        await this.delay(config.API_POLL_INTERVAL);
        retries++;
      }
    }
  
    if (!completed) {
      throw new HotelApiError(`API polling timed out after ${maxRetries} retries`);
    }
  
    logger.debug('API polling completed', { endpoint, params });
    return result as T;
  }
  /**
   * Handles errors by logging them and throwing a HotelApiError.
   * @param {string} message - The error message.
   * @param {any} error - The error object.
   * @throws {HotelApiError} The wrapped error with additional context.
   * @private
   */
  private handleError(message: string, error: any): never {
    logger.error(message, { error: error.message, stack: error.stack });
    throw new HotelApiError(message, (error as any).response?.status);
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

  public getHotelImageUrl(hotel: HotelAPIResponse): string {
    if (hotel.cloudflare_image_url && hotel.image_details) {
      const { prefix, suffix } = hotel.image_details;
      const imageIndex = hotel.default_image_index || 0;
      return `${hotel.cloudflare_image_url}/${prefix}${imageIndex}${suffix}`;
    }
    
    if (hotel.imgix_url && hotel.image_details) {
      const { prefix, suffix } = hotel.image_details;
      const imageIndex = hotel.default_image_index || 0;
      return `${hotel.imgix_url}/${prefix}${imageIndex}${suffix}`;
    }
    
    // Fallback image URL if the required properties are not available
    return 'https://example.com/placeholder-hotel-image.jpg';
  }
}

export default HotelModel;