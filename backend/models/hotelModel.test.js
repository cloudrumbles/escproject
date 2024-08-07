// tests/hotelModel.test.js
import axios from 'axios';
import HotelModel from '../models/HotelModel';

// Mock axios
jest.mock('axios');

describe('HotelModel', () => {
  let hotelModel;

  beforeEach(() => {
    hotelModel = new HotelModel();
    console.log('Created new HotelModel instance for testing');
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.log('Cleared all mocks after test');
  });

  describe('searchHotels', () => {
    it('should poll until completed is true', async () => {
      console.log('Testing searchHotels method');
      
      const mockParams = { destination_id: 'TEST1', checkin: '2023-08-01', checkout: '2023-08-05' };
      console.log('Mock params:', mockParams);

      axios.get
        .mockResolvedValueOnce({ data: { completed: false, hotels: [{ id: 'hotel1' }] } })
        .mockResolvedValueOnce({ data: { completed: false, hotels: [{ id: 'hotel1' }, { id: 'hotel2' }] } })
        .mockResolvedValueOnce({ data: { completed: true, hotels: [{ id: 'hotel1' }, { id: 'hotel2' }, { id: 'hotel3' }] } });

      const result = await hotelModel.searchHotels(mockParams);

      console.log('Number of API calls:', axios.get.mock.calls.length);
      console.log('Final result:', result);

      expect(axios.get).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
      expect(result[2].id).toBe('hotel3');
    });

    it('should handle errors', async () => {
      console.log('Testing searchHotels error handling');

      const mockParams = { destination_id: 'ERROR' };
      console.log('Mock params:', mockParams);

      axios.get.mockRejectedValue(new Error('API error'));

      await expect(hotelModel.searchHotels(mockParams)).rejects.toThrow('API error');
      console.log('Error was thrown as expected');
    });
  });

  describe('getHotelPrice', () => {
    it('should fetch hotel price', async () => {
      console.log('Testing getHotelPrice method');

      const mockHotelId = 'hotel1';
      const mockParams = { checkin: '2023-08-01', checkout: '2023-08-05' };
      console.log('Mock hotel ID:', mockHotelId);
      console.log('Mock params:', mockParams);

      const mockResponse = { data: { rooms: [{ price: 100 }] } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await hotelModel.getHotelPrice(mockHotelId, mockParams);

      console.log('API call URL:', axios.get.mock.calls[0][0]);
      console.log('API call params:', axios.get.mock.calls[0][1]);
      console.log('Result:', result);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('processHotelImages', () => {
    it('should process hotel images correctly', () => {
      console.log('Testing processHotelImages method');

      const mockHotel = {
        id: 'hotel1',
        image_details: {
          prefix: 'https://example.com/images/hotel1_',
          suffix: '.jpg',
          count: 3
        }
      };
      console.log('Mock hotel:', mockHotel);

      const processedHotel = hotelModel.processHotelImages(mockHotel);

      console.log('Processed hotel:', processedHotel);

      expect(processedHotel.images).toHaveLength(3);
      expect(processedHotel.images[0]).toBe('https://example.com/images/hotel1_1.jpg');
      expect(processedHotel.images[2]).toBe('https://example.com/images/hotel1_3.jpg');
    });

    it('should handle hotels without image details', () => {
      console.log('Testing processHotelImages with no image details');

      const mockHotel = { id: 'hotel2' };
      console.log('Mock hotel:', mockHotel);

      const processedHotel = hotelModel.processHotelImages(mockHotel);

      console.log('Processed hotel:', processedHotel);

      expect(processedHotel.images).toBeUndefined();
    });
  });

  describe('formatSearchParams', () => {
    it('should format search parameters correctly', () => {
      console.log('Testing formatSearchParams method');

      const mockSearchCriteria = {
        destinationId: 'DEST1',
        checkIn: '2023-08-01',
        checkOut: '2023-08-05',
        guests: [2, 1],
        language: 'fr_FR',
        currency: 'EUR',
        countryCode: 'FR'
      };
      console.log('Mock search criteria:', mockSearchCriteria);

      const formattedParams = hotelModel.formatSearchParams(mockSearchCriteria);

      console.log('Formatted parameters:', formattedParams);

      expect(formattedParams).toEqual({
        destination_id: 'DEST1',
        checkin: '2023-08-01',
        checkout: '2023-08-05',
        guests: '2|1',
        lang: 'fr_FR',
        currency: 'EUR',
        country_code: 'FR',
        partner_id: '1'
      });
    });

    it('should use default values when not provided', () => {
      console.log('Testing formatSearchParams with default values');

      const mockSearchCriteria = {
        destinationId: 'DEST2',
        checkIn: '2023-09-01',
        checkOut: '2023-09-05',
        guests: 2
      };
      console.log('Mock search criteria:', mockSearchCriteria);

      const formattedParams = hotelModel.formatSearchParams(mockSearchCriteria);

      console.log('Formatted parameters:', formattedParams);

      expect(formattedParams).toEqual({
        destination_id: 'DEST2',
        checkin: '2023-09-01',
        checkout: '2023-09-05',
        guests: '2',
        lang: 'en_US',
        currency: 'USD',
        country_code: 'US',
        partner_id: '1'
      });
    });
  });
});