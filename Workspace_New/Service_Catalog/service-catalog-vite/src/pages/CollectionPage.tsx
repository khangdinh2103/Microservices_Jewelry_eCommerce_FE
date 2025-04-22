import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProduct } from '../contexts/ProductContext';

const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCollectionById, getProductsByCollection, loading } = useProduct();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      if (id) {
        const collectionData = await getCollectionById(parseInt(id));
        setCollection(collectionData);
        
        const productsData = await getProductsByCollection(parseInt(id));
        setProducts(productsData);
      }
    };
    
    fetchData();
  }, [id, getCollectionById, getProductsByCollection]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        {/* Collection Banner */}
        <section className="relative h-[400px] bg-cover bg-center" 
          style={{ 
            backgroundImage: collection?.collectionImages?.[0] 
              ? `url('${collection.collectionImages[0].imageUrl}')` 
              : "url('https://images.unsplash.com/photo-1516575869513-3f418f8902ca?q=80&w=1000&auto=format&fit=crop')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {collection?.name || 'Bộ sưu tập'}
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto">
                {collection?.description || 'Khám phá bộ sưu tập độc quyền của chúng tôi.'}
              </p>
            </div>
          </div>
        </section>
        
        {/* Collection Products */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-12">
                  Sản phẩm trong bộ sưu tập
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">
                  Không có sản phẩm nào trong bộ sưu tập này.
                </p>
              </div>
            )}
          </div>
        </section>
        
        {/* Collection Story (if available) */}
        {collection?.description && (
          <section className="py-16 px-4 bg-gray-100">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-8">Câu chuyện của bộ sưu tập</h2>
              <div 
                className="prose max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: collection.description }}
              />
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CollectionPage;