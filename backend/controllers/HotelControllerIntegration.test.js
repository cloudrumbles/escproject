const HotelController = require('./HotelController');

describe('HotelController', () => {
  let hotelController;

  const testQueryParams = {
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

  // Increase the timeout for all tests in this suite
  jest.setTimeout(30000);

  describe('getDetails', () => {
    it('should fetch hotel details', async () => {
      const hotelId = 'obxM';
      const result = await hotelController.getDetails(hotelId);
      expect(result).toBeDefined();
      expect(result.id).toBe(hotelId);
    });
  });

  describe('getHotels', () => {
    it('should fetch hotels for a given destination', async () => {
      const result = await hotelController.getHotels(testQueryParams.destination_id);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });
  });

  describe('getPrices', () => {
    it('should fetch prices with given parameters', async () => {
      const result = await hotelController.getPrices(testQueryParams);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('converted_price');
    });
  });

  describe('getRooms', () => {
    it('should fetch rooms for a given hotel', async () => {
      const hotels = await hotelController.getHotels(testQueryParams.destination_id);
      const hotelId = hotels[0].id; // Use the first hotel from the list
      const result = await hotelController.getRooms(hotelId, testQueryParams);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('retrieveListingDetails', () => {
    it('should retrieve correct listing details for a given hotel ID', async () => {
      const hotels = await hotelController.getHotels(testQueryParams.destination_id);
      const hotelId = hotels[0].id; // Use the first hotel from the list
      const result = hotelController.retrieveListingDetails(hotels, hotelId);
      expect(result).toBeDefined();
      expect(result.id).toBe(hotelId);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('address');
      expect(result).toHaveProperty('starRating');
      expect(result).toHaveProperty('guestRating');
      expect(result).toHaveProperty('imageUrl');
    });

    it('should return null for non-existent hotel ID', async () => {
      const hotels = await hotelController.getHotels(testQueryParams.destination_id);
      const result = hotelController.retrieveListingDetails(hotels, 'nonexistent_id');
      expect(result).toBeNull();
    });
  });

  describe('createHotelListings', () => {
    it('should create hotel listings correctly', async () => {
      const result = await hotelController.createHotelListings(testQueryParams);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('address');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('imageUrl');
      expect(result[0]).toHaveProperty('starRating');
      expect(result[0]).toHaveProperty('guestRating');
    });
  });
});