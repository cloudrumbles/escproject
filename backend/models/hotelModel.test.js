const HotelModel = require('./HotelModel');

describe('HotelModel', () => {

  let hotelModel 

SearchParams = {
  destination_id: 'WD0M',
  checkin: '2024-10-01',
  checkout: '2024-10-07',
  lang: 'en_US',
  currency: 'SGD',
  country_code: 'SG',
  guests: '2',
  partner_id: '1'
};


  beforeEach(() => {
    hotelModel = new HotelModel();
  });

  describe('fetchHotels', () => {
        it('should return an array of hotels', async () => {
      const hotels = await hotelModel.fetchHotels('RsBU');
      console.log(hotels);
      expect(hotels.length).toBeGreaterThan(0);
    });
  })

  describe('fetchPrices', () => {
    it('should return an array of prices', async () => {
      const prices = await hotelModel.fetchPrices(SearchParams);
      console.log(prices);
      expect(prices.length).toBeGreaterThan(0);
    });
  })
});