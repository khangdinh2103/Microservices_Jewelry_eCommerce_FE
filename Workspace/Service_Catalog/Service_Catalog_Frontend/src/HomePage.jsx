import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
        <h1>Home Page</h1>
        <p>Just for testing</p>
        <Link to="/product/1">Product</Link>
        <Link to="/collection">Collection</Link>
    </div>
  );
};

export default HomePage;