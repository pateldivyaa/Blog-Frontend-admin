import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Blog API endpoints
export const blogAPI = {
  getBlogs: () => apiClient.get('/blogs'),
  
  createBlog: (formData) => {
    return apiClient.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateBlog: (id, data) => apiClient.put(`/blogs/${id}`, data),
  
  deleteBlog: (id) => apiClient.delete(`/blogs/${id}`),
};

// Author API endpoints
export const authorAPI = {
  getAuthors: () => apiClient.get('/authors'),
  
  createAuthor: (data) => apiClient.post('/authors', data),
};

// Admin API endpoints
export const adminAPI = {
  login: (credentials) => apiClient.post('/admin/login', credentials),
};

export default apiClient;