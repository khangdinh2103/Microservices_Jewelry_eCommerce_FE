import React, {Suspense} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RemoteModuleLayout from './components/RemoteModuleLayout';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';

// Lazy load remote modules
const CatalogApp = React.lazy(() => import('catalog/App'));
const AccountApp = React.lazy(() => import('account/App'));

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-grow">
                <ErrorBoundary>
                    <Routes>
                        {/* Trang chủ */}
                        <Route path="/" element={<HomePage />} />

                        {/* Module Catalog */}
                        <Route
                            path="/catalog/*"
                            element={
                                <RemoteModuleLayout title="Bộ Sưu Tập Trang Sức">
                                    <CatalogApp />
                                </RemoteModuleLayout>
                            }
                        />

                        {/* Module Account */}
                        <Route
                            path="/account/*"
                            element={
                                <RemoteModuleLayout>
                                    <AccountApp />
                                </RemoteModuleLayout>
                            }
                        />

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

            <Footer />
        </div>
    );
}

export default App;
