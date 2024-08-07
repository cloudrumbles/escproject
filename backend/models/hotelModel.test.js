const HotelModel = require('./HotelModel');

describe('HotelModel with real API', () => {
  let hotelModel;

  beforeEach(() => {
    hotelModel = new HotelModel();
  });

  describe('searchHotels', () => {
    it('should fetch hotel prices for a destination', async () => {
      const params = {
        destination_id: 'WD0M',
        checkin: '2024-10-01',
        checkout: '2024-10-07',
        lang: 'en_US',
        currency: 'SGD',
        country_code: 'SG',
        guests: '2',
        partner_id: '1'
      };

      const result = await hotelModel.searchHotels(params);

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('searchRank');
        expect(result[0]).toHaveProperty('price');
        expect(result[0]).toHaveProperty('market_rates');
      }
    }, 30000); // Increase timeout to 30 seconds for API call

    it('should handle errors for invalid parameters', async () => {
      const invalidParams = { destination_id: 'INVALID' };
      await expect(hotelModel.searchHotels(invalidParams)).rejects.toThrow();
    });
  });

  describe('getHotelPrice', () => {
    it('should fetch hotel price for a specific hotel', async () => {
      const hotelId = 'diH7'; // You may need to use a valid hotel ID
      const params = {
        destination_id: 'WD0M',
        checkin: '2024-10-01',
        checkout: '2024-10-07',
        lang: 'en_US',
        currency: 'SGD',
        country_code: 'SG',
        guests: '2',
        partner_id: '1'
      };

      const result = await hotelModel.getHotelPrice(hotelId, params);

      expect(result).toHaveProperty('completed');
      expect(result).toHaveProperty('rooms');
      expect(Array.isArray(result.rooms)).toBe(true);
      
      if (result.rooms.length > 0) {
        const firstRoom = result.rooms[0];
        expect(firstRoom).toHaveProperty('key');
        expect(firstRoom).toHaveProperty('roomNormalizedDescription');
        expect(firstRoom).toHaveProperty('price');
        expect(firstRoom).toHaveProperty('images');
        expect(firstRoom).toHaveProperty('amenities');
        expect(firstRoom).toHaveProperty('description');
        expect(firstRoom).toHaveProperty('long_description');
      }
    }, 30000);

    it('should handle errors for invalid hotel ID', async () => {
      const invalidHotelId = 'INVALID';
      const params = { checkin: '2024-10-01' };
      await expect(hotelModel.getHotelPrice(invalidHotelId, params)).rejects.toThrow();
    });
  });

  describe('getHotelDetails', () => {
    it('should fetch hotel details', async () => {
      const hotelId = 'diH7'; // You may need to use a valid hotel ID

      const result = await hotelModel.getHotelDetails(hotelId);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('latitude');
      expect(result).toHaveProperty('longitude');
      expect(result).toHaveProperty('image_details');
    }, 30000);

    it('should return an empty object for invalid hotel ID', async () => {
      const invalidHotelId = 'INVALID';
      const result = await hotelModel.getHotelDetails(invalidHotelId);
      expect(result).toEqual({});
    });
  });


  describe('formatSearchParams', () => {
    it('should format search parameters correctly', () => {
      const mockSearchCriteria = {
        destinationId: 'WD0M',
        checkIn: '2024-10-01',
        checkOut: '2024-10-07',
        language: 'en_US',
        currency: 'SGD',
        countryCode: 'SG',
        guests: [2, 2]
      };

      const result = hotelModel.formatSearchParams(mockSearchCriteria);

      expect(result).toEqual({
        destination_id: 'WD0M',
        checkin: '2024-10-01',
        checkout: '2024-10-07',
        lang: 'en_US',
        currency: 'SGD',
        country_code: 'SG',
        guests: '2|2',
        partner_id: '1'
      });
    });

    it('should use default values when not provided', () => {
      const mockSearchCriteria = {
        destinationId: 'WD0M',
        checkIn: '2024-10-01',
        checkOut: '2024-10-07',
        guests: 2
      };

      const result = hotelModel.formatSearchParams(mockSearchCriteria);

      expect(result).toEqual({
        destination_id: 'WD0M',
        checkin: '2024-10-01',
        checkout: '2024-10-07',
        lang: 'en_US',
        currency: 'USD',
        country_code: 'US',
        guests: '2',
        partner_id: '1'
      });
    });
  });

  describe('formatGuestsString', () => {
    it('should format guests array correctly', () => {
      const result = hotelModel.formatGuestsString([2, 2, 1]);
      expect(result).toBe('2|2|1');
    });

    it('should handle single guest number', () => {
      const result = hotelModel.formatGuestsString(2);
      expect(result).toBe('2');
    });
  });

  describe('processHotelImages', () => {
    it('should process hotel images correctly', () => {
      const mockHotel = {
        image_details: {
          prefix: 'https://example.com/hotel_',
          suffix: '.jpg',
          count: 3
        }
      };

      const result = hotelModel.processHotelImages(mockHotel);

      expect(result.images).toEqual([
        'https://example.com/hotel_1.jpg',
        'https://example.com/hotel_2.jpg',
        'https://example.com/hotel_3.jpg'
      ]);
    });

    it('should return hotel unchanged if no image details', () => {
      const mockHotel = { name: 'Test Hotel' };
      const result = hotelModel.processHotelImages(mockHotel);
      expect(result).toEqual(mockHotel);
    });
  });
});