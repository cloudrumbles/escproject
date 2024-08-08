const HotelModel = require('../models/HotelModel');

async function getSimplifiedHotelData(params) {
  const hotelModel = new HotelModel();
  
  try {
    console.log('Searching for hotels...');
    const searchResults = await hotelModel.searchHotels(params);
    
    if (!Array.isArray(searchResults)) {
      console.error('Unexpected search results structure:', searchResults);
      return [];
    }

    const simplifiedHotels = searchResults.map(hotel => ({
      id: hotel.id,
      price: hotel.converted_price
    }));

    console.log(`Processed ${simplifiedHotels.length} hotels`);
    return simplifiedHotels;
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

console.log('Starting simplified hotel data processing');
getSimplifiedHotelData(params)
  .then(hotels => {
    if (hotels.length === 0) {
      console.log('No hotels found or error occurred.');
    } else {
      console.log(`Successfully processed ${hotels.length} hotels.`);
      console.log('First few hotels:', JSON.stringify(hotels.slice(0, 5), null, 2));
    }
  })
  .catch(error => console.error('Unhandled error:', error.message));