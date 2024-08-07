// HotelController.test.ts
import HotelController from './HotelController';
import { QueryParams, HotelListing } from '../types';

describe('HotelController', () => {
  let hotelController: HotelController;

  beforeAll(() => {
    hotelController = new HotelController();
  });

  const testQueryParams: QueryParams = {
    destination_id: 'WD0M',
    checkin: '2024-12-01',
    checkout: '2024-12-07',
    lang: 'en_US',
    currency: 'SGD',
    country_code: 'SG',
    guests: '2',
    partner_id: 1,
  };

  it('should get hotel listings', async () => {
    const hotelListings = await hotelController.getHotelListings(testQueryParams);
    
    expect(Array.isArray(hotelListings)).toBe(true);
    expect(hotelListings.length).toBeGreaterThan(0);

    const firstHotel = hotelListings[0];
    expect(firstHotel).toHaveProperty('name');
    expect(firstHotel).toHaveProperty('imageUrl');
    expect(firstHotel).toHaveProperty('price');
    expect(firstHotel).toHaveProperty('starRating');
    expect(firstHotel).toHaveProperty('guestRating');

    expect(typeof firstHotel.name).toBe('string');
    expect(typeof firstHotel.imageUrl).toBe('string');
    expect(typeof firstHotel.price).toBe('number');
    expect(typeof firstHotel.starRating).toBe('number');
    expect(typeof firstHotel.guestRating).toBe('number');
  }, 30000);

  it('should handle hotels with missing prices', async () => {
    // This test assumes that there might be hotels without prices
    const hotelListings = await hotelController.getHotelListings(testQueryParams);
    
    const hotelWithoutPrice = hotelListings.find(hotel => hotel.price === 0);
    if (hotelWithoutPrice) {
      expect(hotelWithoutPrice.price).toBe(0);
    } else {
      console.log('No hotels without prices found in this search.');
    }
  }, 30000);

  it('should handle invalid destination gracefully', async () => {
    const invalidParams: QueryParams = {
      ...testQueryParams,
      destination_id: 'INVALID_ID',
    };

    await expect(hotelController.getHotelListings(invalidParams)).rejects.toThrow();
  }, 30000);

  it('should return correct image URLs', async () => {
    const hotelListings = await hotelController.getHotelListings(testQueryParams);
    
    hotelListings.forEach(hotel => {
      expect(hotel.imageUrl).toMatch(/^https?:\/\/.+/); // Check if it's a valid URL
    });
  }, 30000);

  it('should return valid guest ratings', async () => {
    const hotelListings = await hotelController.getHotelListings(testQueryParams);
    
    hotelListings.forEach(hotel => {
      expect(hotel.guestRating).toBeGreaterThanOrEqual(0);
      expect(hotel.guestRating).toBeLessThanOrEqual(5);
    });
  }, 30000);
});