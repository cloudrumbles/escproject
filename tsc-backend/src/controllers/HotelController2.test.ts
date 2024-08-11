import HotelController from './HotelController';
import { QueryParams, HotelListing } from '../types';
import HotelAPI from '../models/HotelAPI';

describe('HotelController', () => {
  let hotelController: HotelController;
  const validDestinationId = 'WD0M';
  const validParams: QueryParams = {
    destination_id: validDestinationId,
    checkin: '2024-09-01',
    checkout: '2024-09-05',
    lang: 'en_US',
    currency: 'SGD',
    country_code: 'SG',
    guests: '2',
    partner_id: 1
  };

  beforeEach(() => {
    hotelController = new HotelController();
  });

  describe('getHotelListings', () => {
    it('should return a list of hotel listings', async () => {
      const hotelListings = await HotelAPI.getHotelPrices(validParams);
      console.log(hotelListings);
    });
  });
});