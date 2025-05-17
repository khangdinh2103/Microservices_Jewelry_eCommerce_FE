import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CollectionPage from './pages/CollectionPage';
import {CartProvider} from './contexts/CartContext';
import CartPage from './pages/CartPage';

function App() {
    return (
        <CartProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/collection/:id" element={<CollectionPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </CartProvider>
    );
}

export default App;
