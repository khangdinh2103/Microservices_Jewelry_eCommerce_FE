import axios from 'axios';

const authBaseURL = 'http://localhost:8101';
const catalogBaseURL = 'http://localhost:8205';
const accountBaseURL = 'http://localhost:8201';

// Tạo instance riêng cho xác thực
const authApi = axios.create({
  baseURL: authBaseURL,
  withCredentials: true // Đảm bảo gửi/nhận cookies giữa các domain
});

export interface AuthResponse {
  data: {
    access_token: string;
    user: {
      id: string;
      email: string;
      name: string;
      avatarUrl?: string;
      role?: {
        id: string;
        name: string;
        permissions?: Array<{
          id: string;
          name: string;
          apiPath: string;
          method: string;
          module: string;
        }>;
      };
    };
  };
}

export const authService = {
  // Chức năng đăng nhập - không được sử dụng trực tiếp trong Service_Catalog
  // chỉ giữ lại để tương thích với code
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await authApi.post('/api/v1/auth/login', {username, password});
    if (response.data?.data?.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await authApi.post('/api/v1/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
    } finally {
      localStorage.removeItem('access_token');
      // Chuyển hướng về trang đăng nhập của Service_Account
      window.location.href = `${accountBaseURL}/login?logout=true`;
    }
  },

  // Hàm này rất quan trọng - được gọi khi Service_Catalog khởi động
  // để lấy token từ refresh token trong cookie
  refreshToken: async (): Promise<string | null> => {
    try {
      console.log('Đang thử lấy token từ refresh token...');
      const response = await authApi.get('/api/v1/auth/refresh', {
        withCredentials: true // Đảm bảo gửi cookies
      });
      
      const accessToken = response.data?.data?.access_token;
      if (accessToken) {
        console.log('Đã nhận access token mới từ refresh token');
        localStorage.setItem('access_token', accessToken);
        return accessToken;
      }
      console.log('Không nhận được access token từ refresh token');
      return null;
    } catch (error) {
      console.error('Lỗi khi refresh token:', error);
      return null;
    }
  },

  getCurrentUser: async () => {
    try {
      // Kiểm tra token trước khi gửi request
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('Không có access token, thử lấy token mới');
        // Thử lấy token mới từ refresh token
        const newToken = await authService.refreshToken();
        if (!newToken) {
          console.log('Không thể lấy token mới');
          return null;
        }
        console.log('Đã lấy token mới thành công');
      }
      
      const response = await authApi.get('/api/v1/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
  
  // Hàm này được gọi khi ứng dụng khởi động
  checkAndGetToken: async (): Promise<boolean> => {
    console.log('Kiểm tra và lấy token nếu cần...');
    if (!localStorage.getItem('access_token')) {
      console.log('Không có access token trong localStorage, thử refresh');
      const token = await authService.refreshToken();
      return !!token;
    }
    console.log('Đã có access token trong localStorage');
    return true;
  }
};