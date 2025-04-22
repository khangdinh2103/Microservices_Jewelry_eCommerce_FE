import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Collection, Product } from '../types';
import { fetchCollectionById, fetchProductsByCollectionId } from '../services/api';

const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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
      const [collectionData, productsData] = await Promise.all([
        fetchCollectionById(id),
        fetchProductsByCollectionId(id)
      ]);
      
      setCollection(collectionData);
      setProducts(productsData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Find main image
  const mainImage = collection?.collectionImages?.find(img => img.isPrimary)?.imageUrl || 
                    collection?.collectionImages?.[0]?.imageUrl ||
                    'https://via.placeholder.com/1200x400';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="h-96 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6 mx-6">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            {/* Collection Banner */}
            <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${mainImage})` }}>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{collection?.name}</h1>
                <p className="text-lg max-w-3xl">{collection?.description}</p>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="container mx-auto px-4 py-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Sản phẩm trong bộ sưu tập</h2>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Không có sản phẩm nào trong bộ sưu tập này.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;