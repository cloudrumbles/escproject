import simpleModel from './simpleModel';
import { QueryParams } from '../types';

describe('simpleModel', () => {
  it('should return a string', async () =>{
    const hotelModel = simpleModel.getInstance();
    const params: QueryParams = {
        destination_id: 'WD0M',
        checkin: '2024-09-01',
        checkout: '2024-09-05',
        lang: 'en_US',
        currency: 'SGD',
        country_code: 'SG',
        guests: '2',
        partner_id: 1
      };

    const  result = await hotelModel.fetchHotelPrices(params);
    console.log("fetching:", result);
  });
});