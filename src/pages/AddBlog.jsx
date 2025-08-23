import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI, authorAPI } from '../utils/api';
import { Upload, Save, ArrowLeft, ImageIcon, User, FileText, Edit3, Sparkles, Camera, X } from 'lucide-react';
import Alert from '../components/Alert';
import toast from 'react-hot-toast';

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await authorAPI.getAuthors();
      setAuthors(response.data);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      setAuthors([{ _id: 'default', name: 'Admin', email: 'admin@gmail.com' }]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.author) {
      newErrors.author = 'Please select an author';
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
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('content', formData.content.trim());
      formDataToSend.append('author', formData.author);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      await blogAPI.createBlog(formDataToSend);
      
      toast.success('Blog created successfully!');
      navigate('/blogs');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create blog';
      toast.error(message);
      console.error('Create blog error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-pink-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-all duration-200 hover:translate-x-1"
          >
            <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all duration-200">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Create Something Amazing</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              New Blog Post
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into compelling stories that inspire and engage your readers
            </p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2"></div>
          
          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Title Section */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <label htmlFor="title" className="text-lg font-semibold text-gray-800">
                      Blog Title
                    </label>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">Required</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 ${
                        errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="What's your story about?"
                    />
                    {errors.title && (
                      <div className="flex items-center space-x-2 mt-3 text-red-600">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <p className="text-sm font-medium">{errors.title}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="group">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <label htmlFor="content" className="text-lg font-semibold text-gray-800">
                      Your Story
                    </label>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">Required</span>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      id="content"
                      name="content"
                      rows={12}
                      value={formData.content}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none placeholder:text-gray-400 leading-relaxed ${
                        errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Share your thoughts, experiences, and insights with the world..."
                    />
                    <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                      {formData.content.length} characters
                    </div>
                    {errors.content && (
                      <div className="flex items-center space-x-2 mt-3 text-red-600">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <p className="text-sm font-medium">{errors.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                
                {/* Author Selection */}
                <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <label htmlFor="author" className="text-lg font-semibold text-gray-800">
                      Author
                    </label>
                  </div>
                  
                  <select
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                      errors.author ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Choose an author</option>
                    {authors.map((author) => (
                      <option key={author._id} value={author._id}>
                        {author.name} ({author.email})
                      </option>
                    ))}
                  </select>
                  
                  {errors.author && (
                    <div className="flex items-center space-x-2 mt-3 text-red-600">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <p className="text-sm font-medium">{errors.author}</p>
                    </div>
                  )}
                </div>

                {/* Image Upload Section */}
                <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg">
                      <Camera className="w-5 h-5" />
                    </div>
                    <label className="text-lg font-semibold text-gray-800">
                      Featured Image
                    </label>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Optional</span>
                  </div>
                  
                  {!imagePreview ? (
                    <div className="relative group">
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label 
                        htmlFor="image" 
                        className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group-hover:scale-105"
                      >
                        <div className="text-center">
                          <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white w-fit mx-auto mb-4 shadow-lg">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                          <p className="text-lg font-medium text-gray-700 mb-2">Drop your image here</p>
                          <p className="text-sm text-gray-500 mb-2">or click to browse</p>
                          <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="sticky top-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                          <span>Publish Blog</span>
                        </>
                      )}
                    </div>
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4 px-4">
                    Your blog will be published immediately and visible to all readers
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Floating Elements */}
        <div className="fixed bottom-8 right-8 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>
        </div>
        <div className="fixed bottom-12 right-16 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="fixed bottom-16 right-12 pointer-events-none">
          <div className="w-1 h-1 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;