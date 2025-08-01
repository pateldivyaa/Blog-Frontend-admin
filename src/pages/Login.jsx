import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { adminAPI } from '../utils/api.js';
import { LogIn, Mail, Lock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      // Add debug logging
      console.log('Attempting login with:', { 
        email: formData.email,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL 
      });

      const response = await adminAPI.login(formData);
      
      // More robust token extraction
      const token = response.data?.token || response.data?.accessToken || response.data?.authToken;
      
      if (!token) {
        throw new Error('No authentication token received from server');
      }
      
      // Store token and user info
      login(token, formData.email);
      toast.success('Login successful!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Full login error:', error);
      
      // More comprehensive error handling
      let message = 'Login failed';
      
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        message = errorData?.error || errorData?.message || `Server error: ${error.response.status}`;
        
        console.error('Server error details:', {
          status: error.response.status,
          data: errorData,
          headers: error.response.headers
        });
      } else if (error.request) {
        // Request was made but no response
        message = 'Cannot connect to server. Please check your internet connection.';
        console.error('Network error - no response:', error.request);
      } else if (error.message) {
        // Something else happened
        message = error.message;
        console.error('Request setup error:', error.message);
      }
      
      toast.error(message);
      
      // If it's a network error, also show in UI
      if (!error.response) {
        setErrors({ general: message });
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo credentials function
  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your blog
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Display */}
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="admin@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-500 space-y-1 text-center">
              <p><strong>Email:</strong> admin@gmail.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-2 w-full text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Click to fill demo credentials
            </button>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {import.meta.env.DEV && (
          <div className="bg-gray-800 text-white p-3 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>API URL: {import.meta.env.VITE_API_BASE_URL || 'undefined'}</p>
            <p>Environment: {import.meta.env.MODE}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;