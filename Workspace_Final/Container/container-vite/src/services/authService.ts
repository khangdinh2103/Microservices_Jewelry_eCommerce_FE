import axiosInstance from './axiosConfig';

interface LoginResponse {
  data: {
    access_token: string;
    user: any;
  };
  message: string;
}

interface ProfileResponse {
  data: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    avatarUrl?: string;
    role?: {
      id: string;
      name: string;
      permissions?: Array<any>;
    };
  };
  message: string;
}

const authService = {
  /**
   * Đăng nhập người dùng
   * @param username Email/tên đăng nhập của người dùng
   * @param password Mật khẩu người dùng
   * @returns Thông tin người dùng và token truy cập
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      username,
      password,
    });

    if (response.data?.data?.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
    }

    return response.data;
  },

  /**
   * Đăng xuất người dùng
   */
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
    }
  },

  /**
   * Đăng ký người dùng mới
   * @param userData Thông tin đăng ký (email, password, name, etc.)
   */
  register: async (userData: any): Promise<any> => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Lấy thông tin người dùng hiện tại
   */
  getCurrentUser: async (): Promise<ProfileResponse | null> => {
    try {
      const response = await axiosInstance.get<ProfileResponse>('/profile');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Kiểm tra người dùng đã đăng nhập hay chưa
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Yêu cầu đặt lại mật khẩu
   * @param email Email của người dùng
   */
  requestPasswordReset: async (email: string): Promise<any> => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Đặt lại mật khẩu
   * @param token Token đặt lại mật khẩu
   * @param password Mật khẩu mới
   * @param confirmPassword Xác nhận mật khẩu mới
   */
  resetPassword: async (token: string, password: string, confirmPassword: string): Promise<any> => {
    const response = await axiosInstance.post('/auth/reset-password', { 
      token, 
      password, 
      confirmPassword 
    });
    return response.data;
  },

  /**
   * Cập nhật thông tin người dùng
   * @param userData Thông tin cần cập nhật
   */
  updateProfile: async (userData: any): Promise<any> => {
    const response = await axiosInstance.put('/profile', userData);
    return response.data;
  }
};

export default authService;