import HotelController from '../controllers/HotelController';
import { QueryParams, HotelListing } from '../types';

describe('HotelController', () => {
  let hotelController: HotelController;

  beforeEach(() => {
    // Create a new instance of HotelController for each test
    hotelController = new HotelController();
  });

  // Increase timeout for API calls
  jest.setTimeout(30000);

  describe('getHotelListings', () => {
    it('should return hotel listings when given valid query params', async () => {
      const queryParams: QueryParams = {
        destination_id: 'WD0M', // Singapore
        checkIn: '2023-08-01',
        checkOut: '2023-08-05',
        guests: '2',
        lang: 'en_US',
        currency: 'USD',
        partner_id: 1
      };

      const result = await hotelController.getHotelListings(queryParams);

      // Check if we got any results
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Check the structure of the first hotel listing
      const firstHotel = result[0];
      expect(firstHotel).toHaveProperty('name');
      expect(firstHotel).toHaveProperty('imageUrl');
      expect(firstHotel).toHaveProperty('price');
      expect(firstHotel).toHaveProperty('starRating');
      expect(firstHotel).toHaveProperty('guestRating');

      // Check types
      expect(typeof firstHotel.name).toBe('string');
      expect(typeof firstHotel.imageUrl).toBe('string');
      expect(typeof firstHotel.price).toBe('number');
      expect(typeof firstHotel.starRating).toBe('number');
      expect(typeof firstHotel.guestRating).toBe('number');

      // Check value ranges
      expect(firstHotel.price).toBeGreaterThan(0);
      expect(firstHotel.starRating).toBeGreaterThanOrEqual(1);
      expect(firstHotel.starRating).toBeLessThanOrEqual(5);
      expect(firstHotel.guestRating).toBeGreaterThanOrEqual(0);
      expect(firstHotel.guestRating).toBeLessThanOrEqual(5);
    });
  });
});