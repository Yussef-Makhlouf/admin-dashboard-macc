import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Adjust scheme if needed (e.g. Bearer_)
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (Unauthorized) - maybe redirect to login
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // localStorage.removeItem('token');
                // window.location.href = '/login'; // Optional: Auto-redirect
            }
        }
        return Promise.reject(error);
    }
);

export default api;
