const HotelModel = require('../models/HotelModel');


class HotelController {
    constructor() {
        this.hotelModel = new HotelModel();
    }

    createHotelListings(hotelDetails, hotelPrices) {
        return hotelDetails.map(hotel => {
          const pricing = hotelPrices.find(price => price.id === hotel.id);
          
          if (!pricing) {
            return null; // Skip hotels without pricing information
          }
      
          return {
            id: hotel.id,
            name: hotel.name,
            starRating: hotel.rating,
            guestRating: parseFloat(hotel.trustyou.score.kaligo_overall) || 0,
            price: pricing.converted_price,
            imageUrl: `${hotel.cloudflare_image_url}/${hotel.id}/${hotel.default_image_index}.jpg`
          };
        }).filter(listing => listing !== null);
      }

}


