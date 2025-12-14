import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication
export const registerParent = (data) => api.post('/api/auth/parent/register', data);
export const loginParent = (data) => api.post('/api/auth/parent/login', data);
export const loginAdmin = (data) => api.post('/api/auth/admin/login', data);

// Parent endpoints
export const getMyChildren = (parentId) => api.get(`/api/parent/${parentId}/students`);
export const getMyInvoices = (parentId) => api.get(`/api/parent/${parentId}/invoices`);
export const getMyPayments = (parentId) => api.get(`/api/parent/${parentId}/payments`);
export const getParentProfile = (parentId) => api.get(`/api/parent/${parentId}`);

// Admin endpoints
export const getAllStudents = () => api.get('/api/students');
export const getAllParents = () => api.get('/api/admin/parents');
export const getAllInvoices = () => api.get('/api/invoices');
export const createStudent = (data) => api.post('/api/students', data);
export const createInvoice = (data) => api.post('/api/invoices', data);

// Payment
export const makePayment = (data) => api.post('/api/pay', data);

export default api;