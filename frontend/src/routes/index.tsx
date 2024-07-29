import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// import Search from '../pages/Search';
// import Booking from '../pages/Booking';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    {/* <Route path="/search" element={<Search />} />
    <Route path="/book" element={<Booking />} /> */}
  </Routes>
);

export default AppRoutes;