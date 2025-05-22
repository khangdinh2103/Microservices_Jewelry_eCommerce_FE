import {Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {CartOrderProvider} from './contexts/CartOrderContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import RemoteModuleLayout from './components/RemoteModuleLayout';
import React from 'react';

const AccountApp = React.lazy(() => import('account/App'));
// const CatalogApp = React.lazy(() => import('catalog/App'));
// const CartOrderApp = React.lazy(() => import('cart_order/App'));

function App() {
    return (
        <AuthProvider>
            <CartOrderProvider>
                <div className="flex flex-col min-h-screen bg-gray-50">
                    <Header/>

                    <main className="flex-grow">
                        <ErrorBoundary>
                            <Routes>
                                {/* Trang chủ */}
                                <Route path="/" element={<HomePage/>}/>

                                {/* Module Account */}
                                <Route
                                    path="/account/*"
                                    element={
                                        <RemoteModuleLayout>
                                            <AccountApp/>
                                        </RemoteModuleLayout>
                                    }
                                />

{/*                             
                                <Route
                                    path="/catalog/*"
                                    element={
                                        <RemoteModuleLayout>
                                            <CatalogApp/>
                                        </RemoteModuleLayout>
                                    }
                                />

                             
                                <Route
                                    path="/cart/*"
                                    element={
                                        <RemoteModuleLayout>
                                            <CartOrderApp/>
                                        </RemoteModuleLayout>
                                    }
                                /> */}

                                {/* Handle 404 */}
                                <Route
                                    path="*"
                                    element={
                                        <div className="container mx-auto px-4 py-20 text-center">
                                            <h2 className="text-3xl font-serif text-gray-800 mb-4">Không Tìm Thấy Trang</h2>
                                            <p className="text-gray-600 mb-8">
                                                Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                                            </p>
                                            <a
                                                href="/"
                                                className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition font-medium inline-block"
                                            >
                                                Quay Lại Trang Chủ
                                            </a>
                                        </div>
                                    }
                                />
                            </Routes>
                        </ErrorBoundary>
                    </main>

                    <Footer/>
                </div>
            </CartOrderProvider>
        </AuthProvider>
    );
}

export default App;