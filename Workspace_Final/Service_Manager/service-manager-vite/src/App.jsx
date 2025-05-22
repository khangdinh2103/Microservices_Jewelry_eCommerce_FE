import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminLayout from './pages/AdminLayout';
import ProductsPage from './pages/ProductsPage';
import './App.css';

// Lazy load các trang phụ
// const Dashboard = lazy(() => import('./pages/Dashboard'));
// const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
// const OrdersPage = lazy(() => import('./pages/OrdersPage'));
// const CustomersPage = lazy(() => import('./pages/CustomersPage'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<ProductsPage />} />
        <Route 
          path="dashboard" 
          element={
            <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
              {/* <Dashboard /> */}
            </Suspense>
          } 
        />
        {/* <Route 
          path="categories" 
          element={
            <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
              <CategoriesPage />
            </Suspense>
          } 
        />
        <Route 
          path="orders" 
          element={
            <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
              <OrdersPage />
            </Suspense>
          } 
        />
        <Route 
          path="customers" 
          element={
            <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
              <CustomersPage />
            </Suspense>
          } 
        /> */}
        <Route path="*" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}

export default App;