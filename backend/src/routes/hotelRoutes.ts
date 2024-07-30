import express from 'express';
import { 
  searchDestinations, 
  getHotelPrices, 
  getHotelPrice, 
  getHotels, 
  getHotelDetails 
} from '../controllers/hotelController';

export const hotelRouter = express.Router();

hotelRouter.get('/destinations', searchDestinations);
hotelRouter.get('/prices', getHotelPrices);
hotelRouter.get('/:id/price', getHotelPrice);
hotelRouter.get('/', getHotels);
hotelRouter.get('/:id', getHotelDetails);