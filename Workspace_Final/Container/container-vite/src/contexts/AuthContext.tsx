import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import axios from 'axios';

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
    isAuthenticated: boolean;
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('access_token'));

    const login = async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('http://localhost:8101/api/v1/auth/login', {
                username,
                password,
            });

            if (response.data?.data?.access_token) {
                localStorage.setItem('access_token', response.data.data.access_token);
            }

            setUser(response.data.data.user);
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
            await axios.post(
                'http://localhost:8101/api/v1/auth/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('access_token');

                if (token) {
                    const response = await axios.get('http://localhost:8101/api/v1/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data) {
                        setUser(response.data.data || response.data);
                        setIsAuthenticated(true);
                    }
                }
            } catch (err) {
                console.error('Kiểm tra xác thực thất bại:', err);
                localStorage.removeItem('access_token');
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
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
