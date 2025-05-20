import { Routes, Route } from 'react-router-dom';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';

function App() {
    return (
        <Routes>
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="*" element={<div>Catalog Home</div>} />
        </Routes>
    );
}

export default App;