import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Move API and mock data setup to a separate file, e.g., 'api/hotelApi.ts'
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3100/api/'
});

const mock = new MockAdapter(api);

mock.onGet('/hotels').reply(200, [
  { id: '1', name: 'Hotel A', address: '123 Main St, City A', starRating: 4, guestRating: 2.3, price: 100, imageUrl: 'image-a.jpg' },
  { id: '2', name: 'Hotel B', address: '456 Oak St, City B', starRating: 3, guestRating: 4.7, price: 80, imageUrl: 'image-b.jpg' },
  { id: '3', name: 'Hotel C', address: '789 Pine St, City C', starRating: 5, guestRating: 1.5, price: 150, imageUrl: 'image-c.jpg' },
]);

export default api;