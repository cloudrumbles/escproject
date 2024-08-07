import axios, { AxiosInstance } from 'axios';
import { QueryParams, HotelPrices, HotelPricesResult } from '../types';

class HotelPriceFetcher {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseUrl = 'https://hotelapi.loyalty.dev/api') {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  async fetchHotelPrices(params: QueryParams): Promise<HotelPrices[]> {
    try {
      let completed = false;
      let hotels: HotelPrices[] = [];
      while (!completed) {
        const response = await this.axiosInstance.get<HotelPricesResult>('/hotels/prices', { params });
        const data = response.data;
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response from API');
        }
        
        hotels = [...hotels, ...data.hotels];
        completed = data.completed;

        if (!completed) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      return hotels;
    } catch (error) {
      console.error('Error fetching hotel prices:', error);
      throw error;
    }
  }
}

export default HotelPriceFetcher;