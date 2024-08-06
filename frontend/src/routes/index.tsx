import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HotelListings from '../pages/HotelSearch';
import DetailedView from '../pages/DetailedView';
import HotelSearchNew from '../pages/HotelSearchNew';


const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/listings" element={<HotelListings />} />
    <Route path="/hotel/:id" element={<DetailedView />} />
    <Route path="/test" element={<HotelSearchNew />} /> 
  </Routes>
);

export default AppRoutes;