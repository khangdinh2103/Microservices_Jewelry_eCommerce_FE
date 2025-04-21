import axios from '../utils/axiosConfig';

export interface AuthResponse {
  data: {
    access_token: string;
    user: {
      id: string;
      email: string;
      name: string;
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
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post('/api/v1/auth/login', { username, password });
    if (response.data?.data?.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
    }
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    try {
      await axios.post('/api/v1/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
    }
  },
  
  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await axios.get('/api/v1/auth/refresh');
      const accessToken = response.data?.data?.access_token;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        return accessToken;
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi refresh token:', error);
      return null;
    }
  },
  
  getCurrentUser: async (): Promise<AuthResponse['data']['user'] | null> => {
    try {
      const response = await axios.get('/api/v1/auth/account');
      return response.data?.data?.user || null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      return null;
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  }
};