import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HotelModel from './HotelModel';
import { 
  HotelAPIResponse, 
  QueryParams, 
  HotelPricesResult, 
  Room, 
  RoomResponse
} from '../types';

describe('HotelModel', () => {
  let hotelModel: HotelModel;
  let mockAxios: MockAdapter;

  const BASE_URL = 'https://hotelapi.loyalty.dev/api';
  const TEST_DESTINATION = 'TEST_DEST';
  const ERROR_DESTINATION = 'ERROR_DEST';

  // Factory functions for creating mock data
  const createMockHotel = (id: string): HotelAPIResponse => ({
    id,
    imageCount: 5,
    latitude: 1.23,
    longitude: 4.56,
    name: `Hotel ${id}`,
    address: `${id} Test St`,
    address1: `${id} Test St`,
    rating: 4.5,
    distance: 2.5,
    trustyou: {
      id: `trustyou${id}`,
      score: {
        overall: '4.5',
        kaligo_overall: 90,
        solo: '4.3',
        couple: '4.6',
        family: '4.4',
        business: '4.2'
      }
    },
    categories: {
      location: { name: 'Location', score: 9.2, popularity: 0.8 },
      service: { name: 'Service', score: 8.9, popularity: 0.75 }
    },
    amenities_ratings: [
      { name: 'WiFi', score: 8.5 },
      { name: 'Cleanliness', score: 9.0 }
    ],
    description: `A luxurious hotel ${id} for testing`,
    amenities: { pool: true, gym: true, restaurant: true },
    original_metadata: {
      name: `Hotel ${id}`,
      city: 'Test City',
      state: 'TS',
      country: 'Testland'
    },
    image_details: {
      suffix: '.jpg',
      count: 5,
      prefix: `hotel_${id}_`
    },
    hires_image_index: '0',
    number_of_images: 5,
    default_image_index: 0,
    imgix_url: 'https://example.com/imgix',
    cloudflare_image_url: 'https://example.com/cloudflare'
  });

  const createMockHotelPrices = (id: string, completed: boolean): HotelPricesResult => ({
    searchCompleted: null,
    completed,
    status: null,
    currency: 'USD',
    hotels: [{
      id,
      searchRank: parseInt(id),
      price_type: 'CASH',
      max_cash_payment: 1000,
      coverted_max_cash_payment: 1000,
      points: 0,
      bonuses: 0,
      bonus_programs: [],
      bonus_tiers: [],
      lowest_price: 800,
      price: 900,
      converted_price: 900,
      lowest_converted_price: 800,
      market_rates: [{ supplier: `Supplier ${id}`, rate: 850 }]
    }]
  });

  const createMockRoomResponse = (): RoomResponse => ({
    searchCompleted: true,
    completed: true,
    status: 'success',
    currency: 'USD',
    rooms: [
      {
        key: 'room1',
        roomDescription: 'Standard Room',
        roomNormalizedDescription: 'standard-room',
        type: 'standard',
        free_cancellation: true,
        roomAdditionalInfo: {
          breakfastInfo: 'Breakfast included',
          displayFields: {
            special_check_in_instructions: null,
            check_in_instructions: 'Check-in after 2 PM',
            know_before_you_go: null,
            fees_optional: null,
            fees_mandatory: null,
            kaligo_service_fee: 10,
            hotel_fees: [],
            surcharges: []
          }
        },
        description: 'A comfortable standard room',
        long_description: 'A spacious and comfortable standard room with all amenities',
        images: [
          {
            url: 'https://example.com/room1.jpg',
            highResolutionUrl: 'https://example.com/room1_hires.jpg',
            heroImage: true
          }
        ],
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        price_type: 'CASH',
        max_cash_payment: 1000,
        coverted_max_cash_payment: 1000,
        points: 0,
        bonuses: 0,
        bonus_programs: [],
        bonus_tiers: [],
        lowest_price: 800,
        price: 900,
        converted_price: 900,
        lowest_converted_price: 800,
        chargeableRate: 900,
        market_rates: [{ supplier: 'Supplier A', rate: 850 }],
        base_rate: 800,
        included_taxes_and_fees_total: 100,
        excluded_taxes_and_fees_currency: 'USD',
        excluded_taxes_and_fees_total: 0,
        excluded_taxes_and_fees_total_in_currency: 0,
        included_taxes_and_fees: [{ id: 'tax1', amount: 100 }]
      }
    ]
  });

  const mockQueryParams: QueryParams = {
    destination_id: TEST_DESTINATION,
    checkIn: '2024-01-01',
    checkOut: '2024-01-07',
    guests: '2',
    lang: 'en_US',
    currency: 'USD',
    partner_id: 1,
  };

  beforeEach(() => {
    hotelModel = new HotelModel();
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  // Helper function to set up a successful API mock
  const mockSuccessfulApiCall = (endpoint: string, responseData: any) => {
    mockAxios.onGet(`${BASE_URL}${endpoint}`).reply(200, responseData);
  };

  // Helper function to set up a failed API mock
  const mockFailedApiCall = (endpoint: string) => {
    mockAxios.onGet(`${BASE_URL}${endpoint}`).reply(500);
  };

  describe('fetchHotels', () => {
    it('should fetch hotels successfully', async () => {
      const mockHotels = [createMockHotel('1'), createMockHotel('2')];
      mockSuccessfulApiCall(`/hotels?destination_id=${TEST_DESTINATION}`, mockHotels);

      const result = await hotelModel.fetchHotels(TEST_DESTINATION);
      expect(result).toEqual(mockHotels);
    });

    it('should handle errors when fetching hotels', async () => {
      mockFailedApiCall(`/hotels?destination_id=${ERROR_DESTINATION}`);
      await expect(hotelModel.fetchHotels(ERROR_DESTINATION)).rejects.toThrow();
    });
  });

  describe('fetchHotelPrices', () => {
    it('should fetch hotel prices successfully', async () => {
      const mockResult1 = createMockHotelPrices('1', false);
      const mockResult2 = createMockHotelPrices('2', true);

      mockAxios
        .onGet(`${BASE_URL}/hotels/prices`)
        .replyOnce(200, mockResult1)
        .onGet(`${BASE_URL}/hotels/prices`)
        .replyOnce(200, mockResult2);

      const result = await hotelModel.fetchHotelPrices(mockQueryParams);
      expect(result).toEqual([...mockResult1.hotels, ...mockResult2.hotels]);
    });

    it('should handle errors when fetching hotel prices', async () => {
      mockFailedApiCall('/hotels/prices');
      await expect(hotelModel.fetchHotelPrices(mockQueryParams)).rejects.toThrow();
    });
  });

  describe('fetchHotelDetails', () => {
    it('should fetch hotel details successfully', async () => {
      const mockHotel = createMockHotel('1');
      mockSuccessfulApiCall('/hotels/1', mockHotel);

      const result = await hotelModel.fetchHotelDetails('1');
      expect(result).toEqual(mockHotel);
    });

    it('should handle errors when fetching hotel details', async () => {
      mockFailedApiCall('/hotels/ERROR_ID');
      await expect(hotelModel.fetchHotelDetails('ERROR_ID')).rejects.toThrow();
    });
  });

  describe('fetchRooms', () => {
    it('should fetch rooms successfully', async () => {
      const mockRooms = createMockRoomResponse();
      mockSuccessfulApiCall('/hotels/1/prices', mockRooms);

      const result = await hotelModel.fetchRooms('1', mockQueryParams);
      expect(result).toEqual(mockRooms);
    });

    it('should handle errors when fetching rooms', async () => {
      mockFailedApiCall('/hotels/ERROR_ID/prices');
      await expect(hotelModel.fetchRooms('ERROR_ID', mockQueryParams)).rejects.toThrow();
    });
  });

  describe('formatSearchParams', () => {
    it('should format search parameters correctly', () => {
      const searchCriteria = {
        destinationId: TEST_DESTINATION,
        checkIn: '2024-01-01',
        checkOut: '2024-01-07',
        guests: 2,
        language: 'fr_FR',
        currency: 'EUR',
      };

      const result = hotelModel.formatSearchParams(searchCriteria);
      expect(result).toEqual({
        destination_id: TEST_DESTINATION,
        checkIn: '2024-01-01',
        checkOut: '2024-01-07',
        guests: '2',
        lang: 'fr_FR',
        currency: 'EUR',
        partner_id: 1,
      });
    });

    it('should use default values for language and currency if not provided', () => {
      const searchCriteria = {
        destinationId: TEST_DESTINATION,
        checkIn: '2024-01-01',
        checkOut: '2024-01-07',
        guests: 2,
      };

      const result = hotelModel.formatSearchParams(searchCriteria);
      expect(result).toEqual({
        destination_id: TEST_DESTINATION,
        checkIn: '2024-01-01',
        checkOut: '2024-01-07',
        guests: '2',
        lang: 'en_US',
        currency: 'USD',
        partner_id: 1,
      });
    });

    it('should handle multiple guests correctly', () => {
      const searchCriteria = {
        destinationId: TEST_DESTINATION,
        checkIn: '2024-01-01',
        checkOut: '2024-01-07',
        guests: [2, 1],
      };

      const result = hotelModel.formatSearchParams(searchCriteria);
      expect(result.guests).toBe('2|1');
    });
  });
});