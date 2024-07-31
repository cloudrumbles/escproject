import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HotelListings from '../pages/HotelSearch';
import HotelDetails from '../pages/HotelDetails';
import Test from '../pages/Test';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/listings" element={<HotelListings />} />
    <Route path="/hotel/:id" element={<HotelDetails />} />
    <Route path="/test" element={<Test />} />
  </Routes>
);

export default AppRoutes;