import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('access_token'));

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(username, password);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        console.log('Khởi động ứng dụng, kiểm tra xác thực...');
        
        // Kiểm tra và lấy token từ refresh token nếu cần
        const hasToken = await authService.checkAndGetToken();
        console.log('Kết quả kiểm tra token:', hasToken);
        
        if (hasToken) {
          try {
            console.log('Đang lấy thông tin user...');
            const userData = await authService.getCurrentUser();
            if (userData) {
              console.log('Đã nhận thông tin user:', userData);
              setUser(userData.data || userData);
              setIsAuthenticated(true);
            } else {
              console.log('Không lấy được thông tin user');
            }
          } catch (err) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", err);
          }
        } else {
          console.log('Không có token hợp lệ');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Kiểm tra xác thực thất bại:', err);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};