import axios from 'axios';
import { Mutex } from 'async-mutex';
import { authService } from '../services/authService';

const baseURL = 'http://localhost:8105';
const authBaseURL = 'http://localhost:8101';

const instance = axios.create({
  baseURL,
  withCredentials: true // Đảm bảo cookies được gửi/nhận
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
          const newToken = await authService.refreshToken();
          
          if (newToken) {
            // Cập nhật token và retry request ban đầu
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } else {
            // Nếu không lấy được token mới, điều hướng về trang đăng nhập
            window.location.href = 'http://localhost:8201/login';
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Nếu refresh token không hợp lệ, redirect về trang login của Service Account
          localStorage.removeItem('access_token');
          window.location.href = 'http://localhost:8201/login';
          return Promise.reject(refreshError);
        }
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