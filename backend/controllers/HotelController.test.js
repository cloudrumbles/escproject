const HotelController = require('../controllers/HotelController');

describe('HotelController Integration Tests', () => {
  let hotelController;

  beforeAll(() => {
    hotelController = new HotelController();
  });

  // Increase the timeout for API calls
  jest.setTimeout(30000);

  describe('getHotelListings', () => {
    it('should return hotel listings for a valid query', async () => {
        const queryParams = {
            destination_id: 'WD0M',
            checkin: '2024-10-01',
            checkout: '2024-10-07',
            lang: 'en_US',
            currency: 'SGD',
            country_code: 'SG',
            guests: '2',
            partner_id: '1'
          };

      const listings = await hotelController.getHotelListings(queryParams);

      expect(Array.isArray(listings)).toBe(true);
      expect(listings.length).toBeGreaterThan(0);

      // Check the structure of the first listing
      const firstListing = listings[0];
      expect(firstListing).toHaveProperty('id');
      expect(firstListing).toHaveProperty('name');
      expect(firstListing).toHaveProperty('starRating');
      expect(firstListing).toHaveProperty('guestRating');
      expect(firstListing).toHaveProperty('price');
      expect(firstListing).toHaveProperty('imageUrl');

      // Check data types
      expect(typeof firstListing.id).toBe('string');
      expect(typeof firstListing.name).toBe('string');
      expect(typeof firstListing.starRating).toBe('number');
      expect(typeof firstListing.guestRating).toBe('number');
      expect(typeof firstListing.price).toBe('number');
      expect(typeof firstListing.imageUrl).toBe('string');
    });

    it('should throw an error for invalid destination_id', async () => {
      const queryParams = {
        destination_id: 'INVALID_ID',
        checkIn: '2023-12-01',
        checkOut: '2023-12-05',
        guests: '2',
        lang: 'en_US',
        currency: 'USD',
        country_code: 'US',
        partner_id: 1
      };

      await expect(hotelController.getHotelListings(queryParams)).rejects.toThrow();
    });

    it('should return an empty array if no hotels are found', async () => {
      const queryParams = {
        destination_id: 'WD0M', // Example destination ID for Singapore
        checkIn: '2030-12-01', // Far future date
        checkOut: '2030-12-05',
        guests: '2',
        lang: 'en_US',
        currency: 'USD',
        country_code: 'US',
        partner_id: 1
      };

      const listings = await hotelController.getHotelListings(queryParams);

      expect(Array.isArray(listings)).toBe(true);
      expect(listings.length).toBe(0);
    });
  });

  describe('createHotelListings', () => {
    it('should create correct hotel listings', () => {
      const hotelDetails = [
        {
          id: '1',
          name: 'Test Hotel',
          rating: 4,
          trustyou: { score: { kaligo_overall: '80' } },
          cloudflare_image_url: 'https://example.com',
          default_image_index: '1'
        }
      ];

      const hotelPrices = [
        {
          id: '1',
          converted_price: 100
        }
      ];

      const listings = hotelController.createHotelListings(hotelDetails, hotelPrices);

      expect(listings.length).toBe(1);
      expect(listings[0]).toEqual({
        id: '1',
        name: 'Test Hotel',
        starRating: 4,
        guestRating: 80,
        price: 100,
        imageUrl: 'https://example.com/1/1.jpg'
      });
    });

    it('should filter out hotels without pricing', () => {
      const hotelDetails = [
        { id: '1', name: 'Hotel With Price', rating: 4, trustyou: { score: { kaligo_overall: '80' } }, cloudflare_image_url: 'https://example.com', default_image_index: '1' },
        { id: '2', name: 'Hotel Without Price', rating: 3, trustyou: { score: { kaligo_overall: '70' } }, cloudflare_image_url: 'https://example.com', default_image_index: '1' }
      ];

      const hotelPrices = [
        { id: '1', converted_price: 100 }
      ];

      const listings = hotelController.createHotelListings(hotelDetails, hotelPrices);

      expect(listings.length).toBe(1);
      expect(listings[0].name).toBe('Hotel With Price');
    });
  });
});