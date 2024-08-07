import HotelModel from '../models/HotelModel';
import { QueryParams, HotelListing, HotelAPIResponse, HotelPrices } from '../types';

class HotelController {
  private hotelModel: HotelModel;

  constructor() {
    this.hotelModel = new HotelModel();
  }

  async getHotelListings(queryParams: QueryParams): Promise<HotelListing[]> {
    try {
      // Fetch hotels and their prices concurrently
      const [hotels, hotelPrices] = await Promise.all([
        this.hotelModel.fetchHotels(queryParams.destination_id),
        this.hotelModel.fetchHotelPrices(queryParams)
      ]);

      // Create a map of hotel prices for quick lookup
      const priceMap = new Map(hotelPrices.map(price => [price.id, price]));

      // Transform HotelAPIResponse and HotelPrices into HotelListing
      const hotelListings = hotels.map(hotel => this.transformToHotelListing(hotel, priceMap.get(hotel.id)));

      return hotelListings;
    } catch (error) {
      console.error('Error in getHotelListings:', error);
      throw error;
    }
  }

  private transformToHotelListing(hotel: HotelAPIResponse, price: HotelPrices | undefined): HotelListing {
    return {
      name: hotel.name,
      imageUrl: this.getHotelImageUrl(hotel),
      price: price ? price.price : 0, // Use 0 if price is not available
      starRating: hotel.rating,
      guestRating: hotel.trustyou.score.kaligo_overall / 20, // Assuming kaligo_overall is out of 100
    };
  }

  private getHotelImageUrl(hotel: HotelAPIResponse): string {
    // Construct the image URL based on the hotel's image details
    // This is a placeholder implementation - adjust according to your actual image URL structure
    return `${hotel.cloudflare_image_url}/${hotel.image_details.prefix}${hotel.default_image_index}${hotel.image_details.suffix}`;
  }
}

export default HotelController;