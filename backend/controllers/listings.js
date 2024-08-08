const HotelModel = require('../models/HotelModel');

async function getEnhancedHotelData(params) {
  const hotelModel = new HotelModel();
  
  try {
    console.log('Searching for hotels...');
    const searchResults = await hotelModel.searchHotels(params);
    
    if (!Array.isArray(searchResults)) {
      console.error('Unexpected search results structure:', searchResults);
      return [];
    }

    // Limit to first 10 hotels
    const limitedResults = searchResults.slice(0, 10);
    console.log(`Processing details for first ${limitedResults.length} hotels...`);

    const enhancedHotels = await Promise.all(limitedResults.map(async (hotel) => {
      try {
        const details = await hotelModel.getHotelDetails(hotel.id);
        return {
          id: hotel.id,
          price: hotel.converted_price,
          imageUrl: details.image_details ? `${details.image_details.prefix}1${details.image_details.suffix}` : null,
          starRating: details.rating || null,
          guestRating: details.trustyou?.score?.overall || null
        };
      } catch (error) {
        console.error(`Error fetching details for hotel ${hotel.id}:`, error.message);
        // Return basic info if details fetch fails
        return {
          id: hotel.id,
          price: hotel.converted_price,
          imageUrl: null,
          starRating: null,
          guestRating: null
        };
      }
    }));

    console.log(`Processed ${enhancedHotels.length} hotels`);
    return enhancedHotels;
  } catch (error) {
    console.error('Error processing hotel data:', error.message);
    return [];
  }
}

// Example usage
const params = {
  destination_id: 'WD0M',
  checkin: '2024-09-01',
  checkout: '2024-09-05',
  lang: 'en_US',
  currency: 'SGD',
  country_code: 'SG',
  guests: '2',
  partner_id: 1
};

console.log('Starting enhanced hotel data processing (limited to 10)');
getEnhancedHotelData(params)
  .then(hotels => {
    if (hotels.length === 0) {
      console.log('No hotels found or error occurred.');
    } else {
      console.log(`Successfully processed ${hotels.length} hotels.`);
      console.log('Processed hotels:', JSON.stringify(hotels, null, 2));
    }
  })
  .catch(error => console.error('Unhandled error:', error.message));