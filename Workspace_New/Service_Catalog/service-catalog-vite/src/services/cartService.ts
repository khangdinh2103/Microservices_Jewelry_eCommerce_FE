import axios from 'axios';

const CART_API_URL = 'http://localhost:8106/api/v1'; // URL của Cart_Order service

interface CartItem {
  cartItemID: number;
  productID: number;
  productName: string;
  quantity: number;
  price: number;
  imageURL: string | null;
}

interface Cart {
  cartId: number;
  items: CartItem[];
}

export const cartService = {
  getCart: async (userId: number): Promise<Cart> => {
    try {
      const response = await axios.get(`${CART_API_URL}/cart/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      throw new Error('Không thể tải giỏ hàng');
    }
  },
  
  addToCart: async (cartID: number, productID: number, quantity: number): Promise<any> => {
    try {
      const response = await axios.post(`${CART_API_URL}/cart-items`, {
        cartID,
        productID,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  },
  
  updateQuantity: async (cartItemID: number, quantity: number): Promise<any> => {
    try {
      const response = await axios.put(`${CART_API_URL}/cart-items/${cartItemID}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      throw new Error('Không thể cập nhật số lượng sản phẩm');
    }
  },
  
  removeItem: async (cartItemID: number): Promise<any> => {
    try {
      const response = await axios.delete(`${CART_API_URL}/cart-items/${cartItemID}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  }
};