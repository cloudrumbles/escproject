import HotelPriceFetcher from './HotelPriceFetcher';
import { HotelPrices } from '../types';

describe('HotelPriceFetcher', () => {
  let priceFetcher: HotelPriceFetcher;

  beforeAll(() => {
    priceFetcher = new HotelPriceFetcher();
  });

  it('should fetch hotel prices successfully', async () => {
    const params = {
      destination_id: 'WD0M', 
      checkIn: '2024-09-01',
      checkOut: '2024-09-05',
      guests: '2',
      partner_id: 1,
      currency: 'USD',
      lang: 'en_US'
    };

    try {
      const result = await priceFetcher.fetchHotelPrices(params);

      // Assertions
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Check structure of the first hotel price object
      const firstHotel = result[0];
      expect(firstHotel).toHaveProperty('id');
      expect(firstHotel).toHaveProperty('price');
      expect(firstHotel).toHaveProperty('currency');

      // Log the first few results for manual inspection
      console.log('First few hotel prices:', result.slice(0, 3));

    } catch (error) {
      fail(`Test failed with error: ${error}`);
    }
  }, 30000); // Increase timeout to 30 seconds for API call

  // Add more tests here as needed
});