import axios from 'axios';
import { Mutex } from 'async-mutex';

const baseURL = 'http://localhost:8105';
const authBaseURL = 'http://localhost:8101';

const instance = axios.create({
  baseURL,
  withCredentials: true
});

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (!config.headers.Accept && !config.headers['Content-Type']) {
      config.headers.Accept = 'application/json';
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 Unauthorized và không phải request login/refresh và chưa thử retry
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes('/api/v1/auth/login') &&
      !originalRequest._retry &&
      !originalRequest.headers[NO_RETRY_HEADER]
    ) {
      originalRequest._retry = true;

      // Sử dụng mutex để tránh nhiều request refresh token cùng lúc
      return mutex.runExclusive(async () => {
        try {
          // Gọi API refresh từ service account
          const authApi = axios.create({ baseURL: authBaseURL, withCredentials: true });
          const response = await authApi.get('/api/v1/auth/refresh');
          const newToken = response.data?.data?.access_token;
          
          if (newToken) {
            localStorage.setItem('access_token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Nếu refresh token không hợp lệ, redirect về trang login của Service Account
          localStorage.removeItem('access_token');
          window.location.href = 'http://localhost:8201/login';
        }
        
        return Promise.reject(error);
      });
    }

    // Xử lý lỗi refresh token
    if (
      error.response?.status === 400 &&
      error.config.url.includes('/api/v1/auth/refresh')
    ) {
      localStorage.removeItem('access_token');
      window.location.href = 'http://localhost:8201/login';
    }
    
    return Promise.reject(error);
  }
);

export default instance;