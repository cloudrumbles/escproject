import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import HotelController from './controllers/HotelController';
import { QueryParams } from './types';
import { validateQueryParams } from './utils/validators';
import { ValidationError, ApiError } from './errors';
import logger from './logger';

export function createApp(): Express {
  const app: Express = express();
  const hotelController = new HotelController();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the Hotel API!');
  });

  app.get('/api/hotels', validateQueryParams, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParams: QueryParams = {
        destination_id: req.query.destination_id as string,
        checkin: req.query.checkin as string,
        checkout: req.query.checkout as string,
        guests: req.query.guests as string,
        lang: (req.query.lang as string) || 'en_US',
        currency: (req.query.currency as string) || 'SGD',
        partner_id: 1,
        country_code: (req.query.country_code as string) || 'SG',
      };

      const hotelListings = await hotelController.getHotelListings(queryParams);
      res.json(hotelListings);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/error-test', (req: Request, res: Response, next: NextFunction) => {
    next(new Error('Test error'));
  });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  
  if (err instanceof ValidationError) {
    res.status(400).json({ error: 'Validation Error', message: err.message });
  } else if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.name, message: err.message });
  } else {
    // For all other errors, send a generic message
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
  }
});


  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3001;
  const app = createApp();
  app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
  });
}