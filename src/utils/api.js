import axios from 'axios';

// Fix: Use consistent environment variable name and add fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || 'https://blog-backend-6jbl.onrender.com/api';

console.log("API BASE URL:", API_BASE_URL); // ✅ should print full URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to prevent hanging requests
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

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
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

// Admin API endpoints with better error handling
export const adminAPI = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials);
      return response;
    } catch (error) {
      // Better error handling
      const message = error.response?.data?.message || error.message || "Login failed";
      console.error("Login error details:", error.response?.data || error.message);
      throw new Error(message);
    }
  },
  
  logout: () => apiClient.post('/admin/logout'),
};

export default apiClient;