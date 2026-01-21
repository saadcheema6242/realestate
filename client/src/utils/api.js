import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Properties API
export const propertiesAPI = {
    getAll: () => api.get('/properties'),
    getById: (id) => api.get(`/properties/${id}`),
    create: (data) => api.post('/properties', data),
    update: (id, data) => api.put(`/properties/${id}`, data),
    delete: (id) => api.delete(`/properties/${id}`),
};

// Bookings API
export const bookingsAPI = {
    getAll: () => api.get('/bookings'),
    create: (data) => api.post('/bookings', data),
    update: (id, data) => api.put(`/bookings/${id}`, data),
};

// Leads API
export const leadsAPI = {
    getAll: () => api.get('/leads'),
    create: (data) => api.post('/leads', data),
    update: (id, data) => api.put(`/leads/${id}`, data),
};

// Chatbot API
export const chatbotAPI = {
    sendMessage: (message, context) => api.post('/chatbot', { message, context }),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
};

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
};

// Upload API
export const uploadAPI = {
    uploadImages: (formData) => api.post('/upload-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default api;