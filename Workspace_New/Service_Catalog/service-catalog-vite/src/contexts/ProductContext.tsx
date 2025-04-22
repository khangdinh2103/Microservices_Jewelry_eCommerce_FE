import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
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
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8105/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error(`Categories API error: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Fetch featured products - assuming we can get featured products from a certain endpoint
        const productsResponse = await fetch('http://localhost:8105/api/products?limit=8');
        if (!productsResponse.ok) {
          throw new Error(`Products API error: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        setFeaturedProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set empty arrays to prevent map() errors
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