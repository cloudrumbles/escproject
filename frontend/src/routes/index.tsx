import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HotelListings from '../pages/HotelSearch';
import HotelDetails from '../pages/HotelDetails';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/listings" element={<HotelListings />} />
    <Route path="/hotel/:id" element={<HotelDetails />} />
  </Routes>
);

export default AppRoutes;