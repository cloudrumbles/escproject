import HotelModel from './HotelModel';
import { QueryParams } from '../types';

describe('HotelModel', () => {
  const hotelModel = new HotelModel();
  const testParams: QueryParams = {
    destination_id: 'WD0M',
    checkIn: '2024-10-01',
    checkOut: '2024-10-07',
    lang: 'en_US',
    currency: 'SGD',
    guests: '2',
    partner_id: 1
  };

  jest.setTimeout(30000); // Increase timeout for API calls

  test('getHotelPrices handles invalid parameters', async () => {
    await expect(hotelModel.getHotelPrices({...testParams, checkIn: 'invalid-date'}))
      .rejects.toThrow('Invalid parameters for hotel price fetch');
  });

  test('getHotelPriceById handles invalid hotel ID', async () => {
    await expect(hotelModel.getHotelPriceById('invalid-id', testParams))
      .rejects.toThrow('Hotel not found: invalid-id');
  });

  test('getHotelsForDestination returns empty array for invalid destination', async () => {
    const result = await hotelModel.getHotelsForDestination('invalid-destination');
    expect(result).toEqual([]);
  });

  test('getHotelById handles invalid hotel ID', async () => {
    await expect(hotelModel.getHotelById('invalid-id'))
      .rejects.toThrow('Hotel not found: invalid-id');
  });

  test('getCompletedHotelPrices handles timeout', async () => {
    const slowModel = new HotelModel('https://httpstat.us/200?sleep=10000');
    await expect(slowModel.getCompletedHotelPrices(testParams))
      .rejects.toThrow('Polling timed out');
  });

  // Tests that should pass
  test('getHotelsForDestination returns hotels for a valid destination', async () => {
    const result = await hotelModel.getHotelsForDestination('WD0M');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('getHotelById returns details for a specific hotel', async () => {
    const hotelId = 'diH7'; // Example hotel ID
    const result = await hotelModel.getHotelById(hotelId);
    expect(result).toBeDefined();
    expect(result.id).toBe(hotelId);
    expect(result.name).toBeDefined();
  });
});