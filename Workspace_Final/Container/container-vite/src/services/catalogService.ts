import axiosInstance from './axiosConfig';

// Cấu hình API Gateway endpoint cho service catalog
const BASE_URL = 'http://localhost:8000/api/v1/catalog';

// Các interfaces cho response data
interface Category {
  id: number;
  name: string;
  description: string;
  url: string;
  productIds: number[];
}

interface Collection {
  id: number;
  name: string;
  description: string;
  collectionImages: CollectionImage[];
  productIds: number[];
}

interface CollectionImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  quantity: number;
  price: number;
  status: string;
  gender: number;
  material: string;
  goldKarat: number;
  color: string;
  brand: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
  collectionId: number;
  collectionName: string;
  productImages: ProductImage[];
}

// Service methods
const catalogService = {
  /**
   * Lấy danh sách danh mục
   */
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/categories`);
    return response.data;
  },

  /**
   * Lấy chi tiết danh mục theo ID
   */
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get(`${BASE_URL}/categories/${id}`);
    return response.data;
  },

  /**
   * Lấy danh sách bộ sưu tập
   */
  getAllCollections: async (): Promise<Collection[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/collections`);
    return response.data;
  },

  /**
   * Lấy chi tiết bộ sưu tập theo ID
   */
  getCollectionById: async (id: number): Promise<Collection> => {
    const response = await axiosInstance.get(`${BASE_URL}/collections/${id}`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm
   */
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/products`);
    return response.data;
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`${BASE_URL}/products/${id}`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm theo danh mục
   */
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm theo bộ sưu tập
   */
  getProductsByCollection: async (collectionId: number): Promise<Product[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/products/collection/${collectionId}`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm bán chạy nhất
   */
  getBestSellingProducts: async (): Promise<Product[]> => {
    // const response = await axiosInstance.get(`${BASE_URL}/products/bestselling`);
    // return response.data;
    return [];
  },

  /**
   * Lấy danh sách sản phẩm tương tự
   */
  getSimilarProducts: async (productId: number): Promise<Product[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/similar`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm theo khoảng giá
   */
  getProductsByPriceRange: async (minPrice: number, maxPrice: number): Promise<Product[]> => {
    const response = await axiosInstance.get(`${BASE_URL}/products/price/between/${minPrice}/${maxPrice}`);
    return response.data;
  },

  /**
   * Lấy URL hình ảnh ngẫu nhiên của sản phẩm thuộc một danh mục
   * @param categoryId ID của danh mục
   * @returns URL của hình ảnh ngẫu nhiên từ một sản phẩm trong danh mục đó
   */
  getRandomProductImageByCategoryId: async (categoryId: number): Promise<string> => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}/random-image`);
      if (response.data && response.data.imageUrl) {
        return response.data.imageUrl;
      } else {
        console.warn(`No image found for category ${categoryId}`);
        return '';
      }
    } catch (error) {
      // Nếu không tìm thấy hình ảnh hoặc có lỗi, trả về chuỗi rỗng
      console.error(`Failed to get random image for category ${categoryId}:`, error);
      return '';
    }
  },
};

export default catalogService;