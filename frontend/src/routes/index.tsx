import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HotelListings from '../pages/HotelSearch';
import DetailedView from '../pages/DetailedView';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/listings" element={<HotelListings />} />
    <Route path="/hotel/:id" element={<DetailedView />} />
  </Routes>
);

export default AppRoutes;