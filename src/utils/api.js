// api.js - Updated with better cold start handling
import axios from 'axios';

// Fix: Use consistent environment variable name and add fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || 'https://blog-backend-6jbl.onrender.com/api';

console.log("API BASE URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // Increased to 2 minutes for cold starts
  withCredentials: true,
});

// Health check function to wake up the server
export const wakeUpServer = async () => {
  try {
    console.log('🔄 Waking up server...');
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      mode: 'cors',
    });
    console.log('✅ Server is awake!');
    return response.ok;
  } catch (error) {
    console.log('⚠️ Server wake-up failed, but this is expected for cold starts');
    return false;
  }
};

// Retry function for cold start scenarios
const retryRequest = async (requestFn, maxRetries = 2) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      if (i > 0) {
        console.log(`🔄 Retry attempt ${i}/${maxRetries}`);
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 5000 * i));
      }
      
      return await requestFn();
    } catch (error) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
      const isNetworkError = error.code === 'ERR_NETWORK';
      
      if ((isTimeout || isNetworkError) && i < maxRetries) {
        console.log(`⏰ Request ${i + 1} failed (likely cold start), retrying...`);
        // Try to wake up the server
        await wakeUpServer();
        continue;
      }
      throw error;
    }
  }
};

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
      message: error.message,
      code: error.code
    });
    
    // Handle common errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

// Blog API endpoints with retry logic
export const blogAPI = {
  getBlogs: () => {
    console.log('Fetching blogs...');
    return retryRequest(() => apiClient.get('/blogs'));
  },
  
  createBlog: (formData) => {
    return retryRequest(() => apiClient.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 180000, // 3 minutes for file uploads
    }));
  },
  
  updateBlog: (id, data) => retryRequest(() => apiClient.put(`/blogs/${id}`, data)),
  
  deleteBlog: (id) => retryRequest(() => apiClient.delete(`/blogs/${id}`)),
};

// Author API endpoints with retry logic
export const authorAPI = {
  getAuthors: () => retryRequest(() => apiClient.get('/authors')),
  
  createAuthor: (data) => retryRequest(() => apiClient.post('/authors', data)),
};

// Admin API endpoints with retry logic
export const adminAPI = {
  login: async (credentials) => {
    try {
      console.log('Attempting login...');
      const response = await retryRequest(() => apiClient.post('/admin/login', credentials));
      console.log('Login successful');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed";
      console.error("Login error details:", error.response?.data || error.message);
      throw new Error(message);
    }
  },
  
  logout: () => retryRequest(() => apiClient.post('/admin/logout')),
  
  // Health check endpoint
  testConnection: () => {
    console.log('Testing backend connection...');
    return retryRequest(() => apiClient.get('/health'));
  }
};

export default apiClient;