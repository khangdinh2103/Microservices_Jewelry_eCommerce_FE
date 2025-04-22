import axios from '../utils/axiosConfig';
import { Product, Category } from '../contexts/ProductContext';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả sản phẩm:', error);
      return [];
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get('/api/categories');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      return [];
    }
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await axios.get(`/api/categories/${categoryId}/products`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm theo danh mục ${categoryId}:`, error);
      return [];
    }
  },
  
  getProductDetail: async (productId: number): Promise<Product> => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy chi tiết sản phẩm ${productId}:`, error);
      throw new Error('Không thể tải thông tin sản phẩm');
    }
  },

  getPopularProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get('/api/products/popular');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm phổ biến:', error);
      return [];
    }
  },

  getBrandsByCategory: async (categoryId: number): Promise<string[]> => {
    try {
      const response = await axios.get(`/api/categories/${categoryId}/brands`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thương hiệu:', error);
      return [];
    }
  },

  getMaterialsByCategory: async (categoryId: number): Promise<string[]> => {
    try {
      const response = await axios.get(`/api/categories/${categoryId}/materials`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chất liệu:', error);
      return [];
    }
  },

  getColorsByCategory: async (categoryId: number): Promise<string[]> => {
    try {
      const response = await axios.get(`/api/categories/${categoryId}/colors`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy màu sắc:', error);
      return [];
    }
  }
};