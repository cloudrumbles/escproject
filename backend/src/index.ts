import express from 'express';
import cors from 'cors';
import { hotelRouter } from './routes/hotelRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/hotels', hotelRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});