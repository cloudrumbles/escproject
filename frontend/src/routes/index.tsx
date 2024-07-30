import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HotelListings from '../pages/HotelSearch';
// import Search from '../pages/Search';
// import Booking from '../pages/Booking';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/listings" element={<HotelListings />} />
  </Routes>
);

export default AppRoutes;