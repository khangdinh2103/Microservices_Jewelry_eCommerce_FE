import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { fetchProductById, fetchSimilarProducts } from '../services/api';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const productData = await fetchProductById(id);
      setProduct(productData);
      
      // Set default selected image
      if (productData.productImages && productData.productImages.length > 0) {
        const primaryImage = productData.productImages.find(img => img.isPrimary);
        setSelectedImage(primaryImage?.imageUrl || productData.productImages[0].imageUrl);
      }
      
      // Fetch similar products với đầy đủ tham số
      if (productData.categoryId) {
        const similarProductsData = await fetchSimilarProducts(
          parseInt(id as string),
          productData.categoryId,
          productData.collectionId,
          productData.brand
        );
        setSimilarProducts(similarProductsData);
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < (product?.quantity || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Define hardcoded product features for display
  const productFeatures = [
    { name: 'Chất liệu', value: product?.material || 'N/A' },
    { name: 'Độ tinh khiết', value: product?.goldKarat ? `${product.goldKarat}K` : 'N/A' },
    { name: 'Màu sắc', value: product?.color || 'N/A' },
    { name: 'Kích thước', value: product?.size || 'N/A' },
    { name: 'Thương hiệu', value: product?.brand || 'N/A' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white">
        {loading ? (
          <div className="h-96 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6 mx-6">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : product ? (
          <>
            {/* Breadcrumbs */}
            <nav className="bg-gray-100 py-2">
              <div className="container mx-auto px-4">
                <ol className="flex flex-wrap text-sm text-gray-600">
                  <li className="flex items-center">
                    <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
                    <span className="mx-2">/</span>
                  </li>
                  {product.categoryName && (
                    <li className="flex items-center">
                      <Link to={`/category/${product.categoryId}`} className="hover:text-gray-900">
                        {product.categoryName}
                      </Link>
                      <span className="mx-2">/</span>
                    </li>
                  )}
                  <li className="text-gray-900 font-medium truncate">{product.name}</li>
                </ol>
              </div>
            </nav>

            {/* Product Details */}
            <section className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Images */}
                <div className="w-full md:w-1/2">
                  <div className="mb-4 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedImage || 'https://via.placeholder.com/500'} 
                      alt={product.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Thumbnail Gallery */}
                  {product.productImages && product.productImages.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {product.productImages.map((image, index) => (
                        <button 
                          key={index} 
                          className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${
                            selectedImage === image.imageUrl ? 'border-gray-900' : 'border-transparent'
                          }`}
                          onClick={() => setSelectedImage(image.imageUrl)}
                        >
                          <img 
                            src={image.imageUrl} 
                            alt={`${product.name} - ${index + 1}`} 
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2">
                  <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                  
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price.toLocaleString('vi-VN')}₫
                    </span>
                    {product.isNew && (
                      <span className="ml-3 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded">Mới</span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-6">{product.description}</p>
                  
                  {/* Product Features */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Thông số chi tiết:</h3>
                    <div className="space-y-2">
                      {productFeatures.map((feature, index) => (
                        <div key={index} className="grid grid-cols-2 text-sm border-b border-gray-200 py-2">
                          <span className="font-medium">{feature.name}</span>
                          <span>{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng:</label>
                    <div className="flex items-center border border-gray-300 rounded w-32">
                      <button 
                        className="px-3 py-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                        onClick={handleDecreaseQuantity}
                      >
                        -
                      </button>
                      <div className="px-3 py-1 border-x border-gray-300 flex-1 text-center">
                        {quantity}
                      </div>
                      <button 
                        className="px-3 py-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                        onClick={handleIncreaseQuantity}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors mb-4">
                    Thêm vào giỏ hàng
                  </button>
                  
                  {/* SKU and Categories */}
                  <div className="text-sm text-gray-600 space-y-1">
                    {product.code && <p>Mã sản phẩm: {product.code}</p>}
                    {product.categoryName && (
                      <p>
                        Danh mục: <Link to={`/category/${product.categoryId}`} className="hover:underline">{product.categoryName}</Link>
                      </p>
                    )}
                    {product.collectionName && (
                      <p>
                        Bộ sưu tập: <Link to={`/collection/${product.collectionId}`} className="hover:underline">{product.collectionName}</Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                  <h2 className="text-2xl font-bold mb-8 text-center">Sản phẩm tương tự</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {similarProducts.slice(0, 4).map(similarProduct => (
                      <ProductCard key={similarProduct.id} product={similarProduct} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;