import {Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import RemoteModuleLayout from './components/RemoteModuleLayout';

// Remote components
import CatalogApp from 'catalog/App';
import AccountApp from 'account/App';

function App() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header/>

                <main className="flex-grow">
                    <ErrorBoundary>
                        <Routes>
                            {/* Trang chủ */}
                            <Route path="/" element={<HomePage/>}/>

                            {/* Module Catalog */}
                            <Route
                                path="/catalog/*"
                                element={
                                    <RemoteModuleLayout title="Bộ Sưu Tập Trang Sức">
                                        <CatalogApp/>
                                    </RemoteModuleLayout>
                                }
                            />

                            {/* Module Account */}
                            <Route
                                path="/account/*"
                                element={
                                    <RemoteModuleLayout>
                                        <AccountApp/>
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

                <Footer/>
            </div>
        </AuthProvider>
    );
}

export default App;