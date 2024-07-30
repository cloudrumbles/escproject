import { Request, Response } from 'express';
import axios from 'axios';
import { Hotel, HotelPrice, RoomPrice } from '../types';

const API_BASE_URL = 'https://hotelapi.loyalty.dev/api';

export const searchDestinations = async (req: Request, res: Response) => {
  try {
    const { term } = req.query;
    // This endpoint doesn't exist in the provided API, so we'll need to implement it on our side
    // For now, let's return a mock response
    const mockDestinations = [
      { UID: 'WD0M', Term: 'New York', Lat: 40.7128, Lng: -74.0060, State: 'NY', Type: 'City' },
      { UID: 'RsBU', Term: 'Los Angeles', Lat: 34.0522, Lng: -118.2437, State: 'CA', Type: 'City' },
    ];
    res.json(mockDestinations.filter(d => d.Term.toLowerCase().includes((term as string).toLowerCase())));
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for destinations' });
  }
};

export const getHotelPrices = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels/prices`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching hotel prices' });
  }
};

export const getHotelPrice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/hotels/${id}/price`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching hotel price' });
  }
};

export const getHotels = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching hotels' });
  }
};

export const getHotelDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/hotels/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching hotel details' });
  }
};