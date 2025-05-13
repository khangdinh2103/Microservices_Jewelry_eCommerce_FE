import axios from 'axios';

const API_URL = 'http://localhost:8101/api/v1';

const authService = {
    login: async (username: string, password: string) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password,
        });

        if (response.data.accessToken) {
            localStorage.setItem('access_token', response.data.accessToken);
        }

        return response.data;
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
        } finally {
            localStorage.removeItem('access_token');
        }
    },

    register: async (userData: any) => {
        return await axios.post(`${API_URL}/auth/register`, userData);
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Parse token and return user info if needed
            return {token};
        }
        return null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};

export default authService;