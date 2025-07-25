import axios from 'axios';

// Fix: Use consistent environment variable name and add fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || 'https://blog-backend-6jbl.onrender.com/api';

console.log("API BASE URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout for Render cold starts
  withCredentials: true, // Enable credentials for CORS
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.baseURL + config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response:`, response.status, response.config.url);
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle common errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    
    // Handle CORS errors specifically
    if (error.message.includes('CORS') || error.code === 'ERR_NETWORK') {
      console.error('CORS Error detected. Check backend CORS configuration.');
    }
    
    return Promise.reject(error);
  }
);

// Blog API endpoints
export const blogAPI = {
  getBlogs: () => {
    console.log('Fetching blogs...');
    return apiClient.get('/blogs');
  },
  
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
      console.log('Attempting login...');
      const response = await apiClient.post('/admin/login', credentials);
      console.log('Login successful');
      return response;
    } catch (error) {
      // Better error handling
      const message = error.response?.data?.message || error.message || "Login failed";
      console.error("Login error details:", error.response?.data || error.message);
      throw new Error(message);
    }
  },
  
  logout: () => apiClient.post('/admin/logout'),
  
  // Add a test endpoint to check backend connectivity
  testConnection: () => {
    console.log('Testing backend connection...');
    return apiClient.get('/health').catch(err => {
      console.error('Backend connection test failed:', err.message);
      throw err;
    });
  }
};

export default apiClient;