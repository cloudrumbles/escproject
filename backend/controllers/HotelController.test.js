const HotelController = require('../controllers/HotelController');

jest.setTimeout(20000);

describe('HotelController', () => {
  let hotelController;

  const queryParams = {
    destination_id: 'WD0M',
    checkin: '2024-10-05',
    checkout: '2024-10-17',
    lang: 'en_US',
    currency: 'SGD',
    country_code: 'SG',
    guests: '2',
    partner_id: '1'
  };

  beforeEach(() => {
    hotelController = new HotelController();
  });

  describe('generateHotelListings', () => {
    it('should return an array of hotel listings', async () => {
      const hotelListings = await hotelController.createHotelListings(queryParams);
      console.log(hotelListings);
      expect(hotelListings.length).toBeGreaterThan(0);
    });
  });
});