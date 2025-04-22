import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProduct } from '../contexts/ProductContext';

const HomePage = () => {
  const { categories, featuredProducts, loading, error } = useProduct();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Log data for debugging
  useEffect(() => {
    if (categories) console.log('Categories:', categories);
    if (featuredProducts) console.log('Featured Products:', featuredProducts);
    if (error) console.error('ProductContext Error:', error);
  }, [categories, featuredProducts, error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white">
        {/* Banner */}
        <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588686693350-f2751be963e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Trang Sức Tinh Tú</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">Khám phá bộ sưu tập trang sức xa xỉ mới nhất của chúng tôi</p>
            <a href="#categories" className="mt-8 px-8 py-3 bg-[#f8f3ea] text-gray-900 hover:bg-opacity-90 transition-colors font-medium rounded-md">
              Khám phá ngay
            </a>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6 mx-6" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Categories */}
        <section id="categories" className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Danh Mục Sản Phẩm</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <Link 
                      to={`/category/${category.id}`} 
                      key={category.id} 
                      className="group overflow-hidden"
                    >
                      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-200 h-64">
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <h3 className="text-white text-2xl font-bold text-center transition-all transform group-hover:scale-110">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <p className="text-gray-500">Không có danh mục sản phẩm nào.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-6 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Sản Phẩm Nổi Bật</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => {
                    const productImages = Array.isArray(product.productImages) ? product.productImages : [];
                    const mainImage = productImages.find(img => img?.isPrimary)?.imageUrl || 
                                    (productImages[0]?.imageUrl || 'https://via.placeholder.com/300');
                    
                    return (
                      <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                        <div className="h-64 overflow-hidden">
                          <img 
                            src={mainImage} 
                            alt={product.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-10">
                            {product.description || 'Trang sức cao cấp từ Tinh Tú'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg text-gray-900">
                              {typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') : '0'}₫
                            </span>
                            <button className="bg-[#333333] text-white px-3 py-1 rounded-md hover:bg-opacity-90 transition-colors">
                              Chi tiết
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center p-8">
                    <p className="text-gray-500">Không có sản phẩm nổi bật nào.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Chọn Chúng Tôi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="mx-auto w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center text-white mb-4">
                  <i className="fas fa-gem text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Chất Lượng Cao Cấp</h3>
                <p className="text-gray-600">Sản phẩm được làm từ chất liệu cao cấp, tỉ mỉ trong từng chi tiết.</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="mx-auto w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center text-white mb-4">
                  <i className="fas fa-award text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Bảo Hành Trọn Đời</h3>
                <p className="text-gray-600">Cam kết bảo hành vĩnh viễn cho mọi sản phẩm của chúng tôi.</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="mx-auto w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center text-white mb-4">
                  <i className="fas fa-truck text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Giao Hàng Nhanh Chóng</h3>
                <p className="text-gray-600">Giao hàng toàn quốc trong vòng 24 giờ, đảm bảo an toàn.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;