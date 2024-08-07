import axios, { AxiosInstance } from 'axios';
import { 
  HotelAPIResponse, 
  HotelPricesResult, 
  RoomResponse, 
  QueryParams 
} from '../types';

class HotelModel {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'https://hotelapi.loyalty.dev/api') {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async getHotelPrices(params: QueryParams): Promise<HotelPricesResult> {
    try {
      const response = await this.axiosInstance.get<HotelPricesResult>('/hotels/prices', { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          throw new Error('Invalid parameters for hotel price fetch');
        }
      }
      throw error;
    }
  }

  async getHotelPriceById(hotelId: string, params: QueryParams): Promise<RoomResponse> {
    try {
      const response = await this.axiosInstance.get<RoomResponse>(`/hotels/${hotelId}/price`, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          throw new Error('Invalid parameters for room price fetch');
        }
        if (error.response?.status === 404) {
          throw new Error(`Hotel not found: ${hotelId}`);
        }
      }
      throw error;
    }
  }

  async getHotelsForDestination(destinationId: string): Promise<HotelAPIResponse[]> {
    try {
      const response = await this.axiosInstance.get<HotelAPIResponse[]>('/hotels', { 
        params: { destination_id: destinationId } 
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async getHotelById(hotelId: string): Promise<HotelAPIResponse> {
    try {
      const response = await this.axiosInstance.get<HotelAPIResponse>(`/hotels/${hotelId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Hotel not found: ${hotelId}`);
      }
      throw error;
    }
  }

  async pollForCompletedResults(
    fetchFunction: () => Promise<HotelPricesResult | RoomResponse>,
    maxAttempts: number = 5,
    interval: number = 2000
  ): Promise<HotelPricesResult | RoomResponse> {
    let attempts = 0;
    while (attempts < maxAttempts) {
      const result = await fetchFunction();
      if (result.completed) {
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }
    throw new Error('Polling timed out');
  }

  async getCompletedHotelPrices(params: QueryParams): Promise<HotelPricesResult> {
    return this.pollForCompletedResults(() => this.getHotelPrices(params)) as Promise<HotelPricesResult>;
  }

  async getCompletedHotelPriceById(hotelId: string, params: QueryParams): Promise<RoomResponse> {
    return this.pollForCompletedResults(() => this.getHotelPriceById(hotelId, params)) as Promise<RoomResponse>;
  }
}

export default HotelModel;