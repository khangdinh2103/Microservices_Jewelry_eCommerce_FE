import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CollectionPage from './pages/CollectionPage';
import CartPage from './pages/CartPage';
// Import các trang khác nếu cần

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/collection/:id" element={<CollectionPage />} />
      <Route path="/cart" element={<CartPage />} />
      {/* Các route khác */}
    </Routes>
  );
};

export default AppRoutes;