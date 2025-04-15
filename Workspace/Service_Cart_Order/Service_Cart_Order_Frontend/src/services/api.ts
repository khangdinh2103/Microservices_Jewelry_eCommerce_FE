// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8206/api';

// API endpoints
export const API_ENDPOINTS = {
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  USER_ORDERS: (userId: number) => `${API_BASE_URL}/orders/user/${userId}`,
  
  // Location
  LOCATION: `${API_BASE_URL}/location`,
  LOCATION_DISTANCE: `${API_BASE_URL}/location/distance`,
  
  // Payment
  PAYMENT: `${API_BASE_URL}/payment`,
  
  // Cart
  CART: (userId: number) => `${API_BASE_URL}/cart/${userId}`,
  CART_ITEMS: (cartItemId: number) => `${API_BASE_URL}/cart-items/${cartItemId}`,
};

// Reusable fetch function with error handling
export const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Example API methods
export const apiService = {
  // Orders
  getUserOrders: (userId: number) => fetchApi(API_ENDPOINTS.USER_ORDERS(userId)),
  createOrder: (orderData: any) => fetchApi(API_ENDPOINTS.ORDERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  }),
  
  // Location
  getAddressFromCoordinates: (lat: number, lng: number) => 
    fetchApi(`${API_ENDPOINTS.LOCATION}?lat=${lat}&lng=${lng}`),
  
  getRouteDistance: (startLat: number, startLng: number, endLat: number, endLng: number) => 
    fetchApi(`${API_ENDPOINTS.LOCATION_DISTANCE}?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}`),
  
  // Payment
  processPayment: (paymentData: any) => fetchApi(API_ENDPOINTS.PAYMENT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  }),
  
  // Cart
  getUserCart: (userId: number) => fetchApi(API_ENDPOINTS.CART(userId)),
  
  updateCartItemQuantity: (cartItemId: number, quantity: number) => fetchApi(API_ENDPOINTS.CART_ITEMS(cartItemId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }),
  
  removeCartItem: (cartItemId: number) => fetchApi(API_ENDPOINTS.CART_ITEMS(cartItemId), {
    method: 'DELETE',
  }),
  
  addToCart: (userId: number, productId: number, quantity: number) => fetchApi(API_ENDPOINTS.CART(userId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  }),
};