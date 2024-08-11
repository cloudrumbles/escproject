import { QueryParams, HotelPricesResult, RoomResponse, HotelAPIResponse } from '../types';

class HotelAPI {
  private baseURL: string;

  constructor(baseURL: string = 'https://hotelapi.loyalty.dev') {
    this.baseURL = baseURL;
  }

  static async getHotelPrices(params: QueryParams): Promise<HotelPricesResult> {
    const url = new URL(`${this.baseURL}/api/hotels/prices`);
    Object.entries(params).forEach(([key, value]) => 
      url.searchParams.append(key, value.toString())
    );
    const response = await fetch(url.toString());
    return response.json();
  }

  static async getHotelPrice(hotelId: string, params: QueryParams): Promise<RoomResponse> {
    const url = new URL(`${this.baseURL}/api/hotels/${hotelId}/price`);
    Object.entries(params).forEach(([key, value]) => 
      url.searchParams.append(key, value.toString())
    );
    const response = await fetch(url.toString());
    return response.json();
  }

  static async getHotelsForDestination(destinationId: string): Promise<HotelAPIResponse[]> {
    const url = new URL(`${this.baseURL}/api/hotels`);
    url.searchParams.append('destination_id', destinationId);
    const response = await fetch(url.toString());
    return response.json();
  }

  static async getHotelDetails(hotelId: string): Promise<HotelAPIResponse> {
    const url = new URL(`${this.baseURL}/api/hotels/${hotelId}`);
    const response = await fetch(url.toString());
    return response.json();
  }
}

export default HotelAPI;