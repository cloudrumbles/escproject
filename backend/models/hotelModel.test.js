const HotelModel = require('../models/HotelModel');

describe('HotelModel', () => {
  let hotelModel;

  const testSearchParams = {
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

  // Increase the timeout for all tests in this suite
  jest.setTimeout(60000); // 60 seconds

  describe('fetchPrices', () => {
    it('should return an array of prices', async () => {
      const prices = await hotelModel.fetchPrices(testSearchParams);
      expect(Array.isArray(prices)).toBe(true);
      expect(prices.length).toBeGreaterThan(0);
      expect(prices[0]).toHaveProperty('id');
      expect(prices[0]).toHaveProperty('price');
    });

    it('should throw an error for invalid parameters', async () => {
      const invalidParams = { ...testSearchParams, destination_id: '' };
      await expect(hotelModel.fetchPrices(invalidParams)).rejects.toThrow();
    });
  });

  describe('fetchHotels', () => {
    it('should return an array of hotels for a given destination', async () => {
      const hotels = await hotelModel.fetchHotels(testSearchParams.destination_id);
      expect(Array.isArray(hotels)).toBe(true);
      expect(hotels.length).toBeGreaterThan(0);
      expect(hotels[0]).toHaveProperty('id');
      expect(hotels[0]).toHaveProperty('name');
    });

    it('should throw an error for an invalid destination ID', async () => {
      await expect(hotelModel.fetchHotels('invalid_id')).rejects.toThrow();
    });
  });

  describe('fetchHotelDetails', () => {
    it('should return hotel details for a given hotel ID', async () => {
      const hotels = await hotelModel.fetchHotels(testSearchParams.destination_id);
      const hotelId = hotels[0].id;
      const details = await hotelModel.fetchHotelDetails(hotelId);
      expect(details).toHaveProperty('id', hotelId);
      expect(details).toHaveProperty('name');
      expect(details).toHaveProperty('address');
    });

    it('should throw an error for an invalid hotel ID', async () => {
      await expect(hotelModel.fetchHotelDetails('invalid_id')).rejects.toThrow();
    });
  });

  describe('fetchRooms', () => {
    it('should return an array of rooms for a given hotel', async () => {
      const hotels = await hotelModel.fetchHotels(testSearchParams.destination_id);
      const hotelId = hotels[0].id;
      const rooms = await hotelModel.fetchRooms(hotelId, testSearchParams);
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBeGreaterThan(0);
      expect(rooms[0]).toHaveProperty('key');
      expect(rooms[0]).toHaveProperty('price');
    });

    it('should throw an error for an invalid hotel ID', async () => {
      await expect(hotelModel.fetchRooms('invalid_id', testSearchParams)).rejects.toThrow();
    });
  });

  describe('constructor', () => {
    it('should use the default base URL if none is provided', () => {
      const model = new HotelModel();
      expect(model.baseUrl).toBe('https://hotelapi.loyalty.dev/api');
    });

    it('should use the provided base URL', () => {
      const customUrl = 'https://custom.api.com';
      const model = new HotelModel(customUrl);
      expect(model.baseUrl).toBe(customUrl);
    });
  });
});