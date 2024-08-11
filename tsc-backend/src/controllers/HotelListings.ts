import HotelModel from '../models/HotelModel';
import { QueryParams, HotelListing, HotelPrices } from '../types';

async function fetchHotelListingsWithPrices(params: QueryParams): Promise<HotelListing[]> {
    const hotelModel = HotelModel.getInstance();
    
    try {
        // Fetch hotel prices
        const hotelPrices: HotelPrices[] = await hotelModel.fetchHotelPrices(params);
        console.log(`Fetched prices for ${hotelPrices.length} hotels`);
        
        // Create an array to store the hotel listings
        const hotelListings: HotelListing[] = [];
        
        // Fetch details for each hotel and create HotelListing objects
        for (const hotel of hotelPrices) {
            try {
                const hotelDetails = await hotelModel.fetchHotelDetails(hotel.id);
                
                const hotelListing: HotelListing = {
                    name: hotelDetails.name,
                    imageUrl: hotelModel.getHotelImageUrl(hotelDetails),
                    price: hotel.price,
                    starRating: hotelDetails.rating,
                    guestRating: hotelDetails.trustyou.score.kaligo_overall
                };
                
                hotelListings.push(hotelListing);
            } catch (error) {
                console.error(`Error fetching details for hotel ${hotel.id}:`, error);
                // Continue with the next hotel if there's an error
            }
        }
        
        return hotelListings;
    } catch (error) {
        console.error('Error fetching hotel listings with prices:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export default fetchHotelListingsWithPrices;