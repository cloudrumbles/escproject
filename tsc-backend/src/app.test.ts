import request from 'supertest';
import { createApp } from './app';
import { Express } from 'express';

describe('Hotel API', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('Health Check and Root Route', () => {
    it('should respond to health check', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('OK');
    });

    it('should respond to root route', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Welcome to the Hotel API!');
    });
  });

  describe('Hotel Listings', () => {
    it('should fetch hotel listings with valid parameters', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .query({
          destination_id: 'WD0M',
          checkin: '2024-12-01',
          checkout: '2024-12-07',
          guests: '2',
          currency: 'SGD',
          partner_id: '1',
          country_code: 'SG',
          lang: 'en_US'
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      
      if (response.body.length > 0) {
        const firstHotel = response.body[0];
        expect(firstHotel).toHaveProperty('name');
        expect(firstHotel).toHaveProperty('imageUrl');
        expect(firstHotel).toHaveProperty('price');
        expect(firstHotel).toHaveProperty('starRating');
        expect(firstHotel).toHaveProperty('guestRating');
      }
    }, 30000);

    it('should handle missing required parameters', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .query({
          checkin: '2024-12-01',
          checkout: '2024-12-07',
          guests: '2'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Missing required query parameters');
    });

    it('should handle invalid date format', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .query({
          destination_id: 'WD0M',
          checkin: 'invalid-date',
          checkout: '2024-12-07',
          guests: '2'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toBe('Invalid date format. Use YYYY-MM-DD');
    });

    it('should handle checkin date after checkout date', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .query({
          destination_id: 'WD0M',
          checkin: '2024-12-07',
          checkout: '2024-12-01',
          guests: '2'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toBe('Checkin date must be before checkout date');
    });

    it('should handle invalid guests number', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .query({
          destination_id: 'WD0M',
          checkin: '2024-12-01',
          checkout: '2024-12-07',
          guests: '-1'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toBe('Guests must be a positive number');
    });

    it('should handle invalid currency', async () => {
        const response = await request(app)
          .get('/api/hotels')
          .query({
            destination_id: 'WD0M',
            checkin: '2024-12-01',
            checkout: '2024-12-07',
            guests: '2',
            currency: 'INVALID_CURRENCY'
          });
      
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Validation Error');
        expect(response.body.message).toBe('Invalid currency');
      });

  describe('Error Handling', () => {
    it('should handle non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });

    it('should handle server errors', async () => {
        const response = await request(app).get('/api/error-test');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Internal Server Error');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('An unexpected error occurred');
      });
  });
});
});