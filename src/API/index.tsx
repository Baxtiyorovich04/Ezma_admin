import axios from "axios";

const baseURL = 'https://s-libraries.uz/api/v1';

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            params: config.params
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api;
