import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchCategories, fetchFeaturedProducts } from '../services/api';
import { Category, Product } from '../types';

interface ProductContextProps {
  categories: Category[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextProps>({
  categories: [],
  featuredProducts: [],
  loading: false,
  error: null
});

export const useProduct = () => useContext(ProductContext);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch các dữ liệu cần thiết
        const [categoriesData, featuredProductsData] = await Promise.all([
          fetchCategories(),
          fetchFeaturedProducts()
        ]);

        console.log('Categories:', categoriesData);
        console.log('Featured Products:', featuredProductsData);

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setFeaturedProducts(Array.isArray(featuredProductsData) ? featuredProductsData : []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching data:', errorMessage);
        setError(errorMessage);
        // Đặt giá trị mặc định là mảng rỗng để tránh lỗi map()
        setCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductContext.Provider value={{ categories, featuredProducts, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};