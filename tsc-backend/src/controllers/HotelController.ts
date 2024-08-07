import HotelModel from '../models/HotelModel';
import { QueryParams, HotelListing, HotelAPIResponse, HotelPrices } from '../types';
import logger from '../logger';

class HotelController {
  private hotelModel: HotelModel;

  constructor() {
    this.hotelModel = HotelModel.getInstance();
  }

  async getHotelListings(queryParams: QueryParams): Promise<HotelListing[]> {
    try {
      const [hotels, hotelPrices] = await Promise.all([
        this.hotelModel.fetchHotels(queryParams.destination_id),
        this.hotelModel.fetchHotelPrices(queryParams)
      ]);

      const priceMap = new Map(hotelPrices.map(price => [price.id, price]));
      return hotels.map(hotel => this.transformToHotelListing(hotel, priceMap.get(hotel.id)));
    } catch (error) {
      logger.error('Error in getHotelListings:', error);
      throw error;
    }
  }

  async getHotelDetails(hotelId: string): Promise<HotelAPIResponse> {
    try {
      return await this.hotelModel.fetchHotelDetails(hotelId);
    } catch (error) {
      logger.error(`Error fetching details for hotel ${hotelId}:`, error);
      throw error;
    }
  }

  private transformToHotelListing(hotel: HotelAPIResponse, price: HotelPrices | undefined): HotelListing {
    return {
      name: hotel.name,
      imageUrl: this.hotelModel.getHotelImageUrl(hotel),
      price: price?.price ?? 0,
      starRating: hotel.rating,
      guestRating: hotel.trustyou?.score?.kaligo_overall ? hotel.trustyou.score.kaligo_overall : 0,
    };
  }
}

export default HotelController;