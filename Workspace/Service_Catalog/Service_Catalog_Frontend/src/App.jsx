import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Product from './Product';
import Collection from './Collection';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product" element={<Product />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </Router>
  )
}
