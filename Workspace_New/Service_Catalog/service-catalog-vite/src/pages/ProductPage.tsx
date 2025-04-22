import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProduct } from '../contexts/ProductContext';
import { Product } from '../types';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, getSimilarProducts, loading } = useProduct();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      if (id) {
        const productData = await getProductById(parseInt(id));
        setProduct(productData);
        
        if (productData) {
          // Set default selected image
          const mainImage = productData.productImages?.find(img => img.isPrimary)?.imageUrl || 
                           productData.productImages?.[0]?.imageUrl;
          setSelectedImage(mainImage || '');
          
          // Set default size if available
          if (productData.size) {
            setSelectedSize(productData.size);
          }
          
          // Fetch similar products
          const similar = await getSimilarProducts(
            productData.id, 
            productData.collection?.id || 0,
            productData.brand || '',
            productData.category?.id || 0
          );
          setSimilarProducts(similar.filter(p => p.id !== productData.id).slice(0, 4));
        }
      }
    };
    
    fetchProduct();
  }, [id, getProductById, getSimilarProducts]);

  if (loading || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        {/* Product Detail */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Images */}
              <div className="w-full lg:w-1/2">
                <div className="sticky top-24">
                  {/* Main Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
                    <img 
                      src={selectedImage || 'https://via.placeholder.com/600x600'} 
                      alt={product.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Image Gallery */}
                  {product.productImages && product.productImages.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {product.productImages.map((image, index) => (
                        <div 
                          key={index}
                          className={`cursor-pointer border-2 rounded-md overflow-hidden h-24 w-24 ${
                            selectedImage === image.imageUrl ? 'border-blue-500' : 'border-transparent'
                          }`}
                          onClick={() => setSelectedImage(image.imageUrl)}
                        >
                          <img 
                            src={image.imageUrl} 
                            alt={`${product.name} - view ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="w-full lg:w-1/2">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-4">
                  <ol className="flex flex-wrap items-center">
                    <li><a href="/" className="hover:text-blue-600">Trang chủ</a></li>
                    <li><span className="mx-2">/</span></li>
                    {product.category && (
                      <>
                        <li>
                          <a href={`/category/${product.category.id}`} className="hover:text-blue-600">
                            {product.category.name}
                          </a>
                        </li>
                        <li><span className="mx-2">/</span></li>
                      </>
                    )}
                    <li className="text-gray-900">{product.name}</li>
                  </ol>
                </nav>
                
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                
                {product.brand && (
                  <div className="mb-4">
                    <span className="font-medium">Thương hiệu:</span> {product.brand}
                  </div>
                )}
                
                <div className="text-2xl font-bold text-gray-900 mb-6">
                  {product.price.toLocaleString('vi-VN')}₫
                </div>
                
                {/* Product Attributes */}
                <div className="border-t border-b py-4 mb-6 space-y-3">
                  {product.material && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium">Chất liệu:</span>
                      <span>{product.material}</span>
                    </div>
                  )}
                  
                  {product.goldKarat && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium">Carat vàng:</span>
                      <span>{product.goldKarat}K</span>
                    </div>
                  )}
                  
                  {product.color && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium">Màu sắc:</span>
                      <span>{product.color}</span>
                    </div>
                  )}
                  
                  {/* Size selection if product has size */}
                  {product.size && (
                    <div className="flex items-start">
                      <span className="w-32 font-medium">Kích thước:</span>
                      <span>{product.size}</span>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <span className="w-32 font-medium">Tình trạng:</span>
                    <span>{product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description || 'Không có mô tả cho sản phẩm này.' }}
                  />
                </div>
                
                {/* Product Features */}
                {product.productFeatures && product.productFeatures.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
                    <table className="w-full border-collapse">
                      <tbody>
                        {product.productFeatures.map((feature, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="py-2 px-4 border font-medium">{feature.name}</td>
                            <td className="py-2 px-4 border">{feature.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="py-12 px-4 bg-gray-100">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Sản phẩm tương tự</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct.id} product={similarProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;