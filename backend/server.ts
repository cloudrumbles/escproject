import express from 'express';
import cors from 'cors';

interface Hotel {
  id: string;
  name: string;
  starRating: number;
  guestRating: number;
  price: number;
  image: string;
  description: string;
}

interface FilterState {
  starRating: number[];
  guestRating: number;
  priceRange: [number, number];
}

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const TOTAL_HOTELS = 100;
const PAGE_SIZE = 10;

const generateAllHotels = (destinationId: string): Hotel[] => {
  return Array.from({ length: TOTAL_HOTELS }, (_, i) => ({
    id: `hotel-${i + 1}`,
    name: `Hotel ${i + 1} in ${destinationId}`,
    starRating: Math.floor(Math.random() * 5) + 1,
    guestRating: Math.floor(Math.random() * 10) + 1,
    price: Math.floor(Math.random() * 500) + 50,
    image: `https://example.com/hotel-${i + 1}.jpg`,
    description: `This is a detailed description for Hotel ${i + 1}.`
  }));
};

app.get('/api/hotels', (req, res) => {
  const destinationId = req.query.destinationId as string;
  const page = parseInt(req.query.page as string) || 1;
  const filters: FilterState = {
    starRating: (req.query.starRating as string || '').split(',').map(Number).filter(Boolean),
    guestRating: parseFloat(req.query.guestRating as string) || 0,
    priceRange: [
      parseFloat(req.query.minPrice as string) || 0,
      parseFloat(req.query.maxPrice as string) || Infinity
    ]
  };

  const allHotels = generateAllHotels(destinationId);
  
  const filteredHotels = allHotels.filter(hotel => 
    (filters.starRating.length === 0 || filters.starRating.includes(hotel.starRating)) &&
    hotel.guestRating >= filters.guestRating &&
    hotel.price >= filters.priceRange[0] &&
    hotel.price <= filters.priceRange[1]
  );

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedHotels = filteredHotels.slice(start, end);

  res.json({
    data: paginatedHotels,
    nextPage: end < filteredHotels.length ? page + 1 : undefined,
    totalPages: Math.ceil(filteredHotels.length / PAGE_SIZE)
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});