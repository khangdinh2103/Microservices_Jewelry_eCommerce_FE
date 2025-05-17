import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import authService from '../services/authService';

interface User {
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
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<void>;
    isAuthenticated: boolean;
    updateProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());

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

    const register = async (userData: any) => {
        try {
            setLoading(true);
            await authService.register(userData);
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (userData: any) => {
        try {
            setLoading(true);
            const response = await authService.updateProfile(userData);
            setUser(prev => ({...prev, ...response.data}));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Cập nhật thông tin thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                if (authService.isAuthenticated()) {
                    const response = await authService.getCurrentUser();
                    if (response) {
                        setUser(response.data);
                        setIsAuthenticated(true);
                    }
                }
            } catch (err) {
                console.error('Kiểm tra xác thực thất bại:', err);
                setIsAuthenticated(false);
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
                register,
                isAuthenticated,
                updateProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};