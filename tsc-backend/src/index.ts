import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import HotelController from './controllers/HotelController';
import { QueryParams } from './types';

const app: Express = express();
const port = 3002;

// Initialize HotelController
const hotelController = new HotelController();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.get('/api/hotels', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = {
      destination_id: req.query.destination_id as string,
      checkIn: req.query.checkIn as string,
      checkOut: req.query.checkOut as string,
      guests: req.query.guests as string,
      lang: (req.query.lang as string) || 'en_US',
      currency: (req.query.currency as string) || 'USD',
      partner_id: 1, // Assuming this is a fixed value
    };

    const hotelListings = await hotelController.getHotelListings(queryParams);
    res.json(hotelListings);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;