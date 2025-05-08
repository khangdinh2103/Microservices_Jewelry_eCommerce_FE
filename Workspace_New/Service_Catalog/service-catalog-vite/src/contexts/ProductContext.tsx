import {createContext, useState, useEffect, useContext, ReactNode} from 'react';
import {fetchCategories, fetchFeaturedProducts} from '../services/api';
import {Category, Product} from '../types';
import {productService} from '../services/productService';
import axios from 'axios';

interface ProductContextProps {
    categories: Category[];
    featuredProducts: Product[];
    loading: boolean;
    error: string | null;
    getCategoryById: (id: number) => Promise<any>; // Thêm nếu chưa có
  getProductsByCategory: (categoryId: number) => Promise<Product[]>;
    getProductsBelowPrice: (maxPrice: number) => Promise<Product[]>;
    getProductsBetweenPrices: (minPrice: number, maxPrice: number) => Promise<Product[]>;
    getProductsAbovePrice: (minPrice: number) => Promise<Product[]>;
}

const ProductContext = createContext<ProductContextProps>({
    categories: [],
    featuredProducts: [],
    loading: false,
    error: null,
    getCategoryById: async () => ({}),
    getProductsByCategory: async () => [],
    getProductsBelowPrice: async () => [],
    getProductsBetweenPrices: async () => [],
    getProductsAbovePrice: async () => [],
});

export const useProduct = () => useContext(ProductContext);

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider = ({children}: ProductProviderProps) => {
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
                const [categoriesData, featuredProductsData] = await Promise.all([fetchCategories(), fetchFeaturedProducts()]);

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

    const getCategoryById = async (id: number): Promise<any> => {
        setLoading(true);
        try {
          // Gọi API lấy thông tin category
          // const response = await axios.get(`/api/categories/${id}`);
          // use fetch instead of axios
          const response = await fetch(`/api/categories/${id}`);
          // console.log('Category:', response.data);
          // setLoading(false);
          // return response.data;
          const data = await response.json();
          console.log('Category:', data);
          setLoading(false);
          return data;
        } catch (error) {
          console.error(`Lỗi khi lấy thông tin danh mục ${id}:`, error);
          setLoading(false);
          return null;
        }
      };
    
      // Đảm bảo hàm getProductsByCategory được implement đúng
      const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
        setLoading(true);
        try {
          // Sửa URL endpoint đúng với backend
          // const response = await axios.get(`/api/products/category/${categoryId}`);
          // setLoading(false);
          // return response.data;
          const response = await fetch(`http://localhost:8105/api/products/category/640`);
          const data = await response.json();
          setLoading(false);
          return data;
        } catch (error) {
          console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryId}:`, error);
          setLoading(false);
          return [];
        }
      };
    
      // Implement các phương thức price filter
      const getProductsBelowPrice = async (maxPrice: number): Promise<Product[]> => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/products/price/below/${maxPrice}`);
          setLoading(false);
          return response.data;
        } catch (error) {
          console.error(`Lỗi khi lấy sản phẩm có giá dưới ${maxPrice}:`, error);
          setLoading(false);
          return [];
        }
      };
    
      const getProductsBetweenPrices = async (minPrice: number, maxPrice: number): Promise<Product[]> => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/products/price/between/${minPrice}/${maxPrice}`);
          setLoading(false);
          return response.data;
        } catch (error) {
          console.error(`Lỗi khi lấy sản phẩm có giá từ ${minPrice} đến ${maxPrice}:`, error);
          setLoading(false);
          return [];
        }
      };
    
      const getProductsAbovePrice = async (minPrice: number): Promise<Product[]> => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/products/price/above/${minPrice}`);
          setLoading(false);
          return response.data;
        } catch (error) {
          console.error(`Lỗi khi lấy sản phẩm có giá trên ${minPrice}:`, error);
          setLoading(false);
          return [];
        }
      };

    return (
        <ProductContext.Provider
            value={{
                categories,
                featuredProducts,
                loading,
                error,
                getCategoryById,
                getProductsByCategory,
                getProductsBelowPrice,
                getProductsBetweenPrices,
                getProductsAbovePrice,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
