import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../utils/api.js';
import { Plus, BookOpen, Users, TrendingUp, Calendar, ArrowUpRight, Sparkles, Eye, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await blogAPI.getBlogs();
      const blogs = response.data;
      
      setStats({
        totalBlogs: blogs.length,
        recentBlogs: blogs.slice(0, 5)
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 absolute top-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your blog</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex -space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">All posts</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Authors</p>
                  <p className="text-3xl font-bold text-gray-900">1</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full border-2 border-white text-white text-xs flex items-center justify-center font-medium">You</div>
              </div>
              <span className="ml-2 text-xs text-gray-500">Content creator</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
            <div className="mt-4 flex items-center">
              <div className="px-2 py-1 bg-purple-100 rounded-full">
                <span className="text-xs text-purple-700 font-medium">Live</span>
              </div>
              <span className="ml-2 text-xs text-gray-500">Ready to view</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="mt-4 flex items-center">
              <div className="px-2 py-1 bg-orange-100 rounded-full">
                <span className="text-xs text-orange-700 font-medium">+100%</span>
              </div>
              <span className="ml-2 text-xs text-gray-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/add-blog"
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl p-8 text-white overflow-hidden hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-blue-700/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Plus className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold mb-1">Create New Blog</h3>
                <p className="text-blue-100 text-sm">Start writing your next masterpiece</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>

          <Link
            to="/blogs"
            className="group relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-8 text-white overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-emerald-700/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold mb-1">Manage Blogs</h3>
                <p className="text-emerald-100 text-sm">View, edit and organize your posts</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>

          <div className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-8 text-white overflow-hidden cursor-not-allowed opacity-75">
            <div className="relative z-10 flex items-center">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold mb-1">Analytics</h3>
                <p className="text-purple-100 text-sm">Insights coming soon...</p>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="px-2 py-1 bg-white/20 rounded-full">
                <span className="text-xs font-medium">Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Blogs</h2>
              </div>
              <Link
                to="/blogs"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium hover:shadow-lg"
              >
                <span>View All</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-8">
            {stats.recentBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No blogs yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Ready to share your thoughts with the world? Create your first blog post and start your journey!</p>
                <Link
                  to="/add-blog"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Blog</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {stats.recentBlogs.map((blog, index) => (
                  <div key={blog._id} className="group flex items-center space-x-6 p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all duration-300 hover:shadow-lg">
                    <div className="flex-shrink-0">
                      {blog.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api','')}/uploads/${blog.image}`}
                          alt={blog.title}
                          className="w-20 h-20 object-cover rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow duration-300">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {blog.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1" style={{ 
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden' 
                          }}>
                            {blog.content.substring(0, 120)}...
                          </p>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {blog.author?.name?.[0] || 'A'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500 font-medium">
                                {blog.author?.name || 'Anonymous'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{formatDate(blog.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-700 font-medium">Published</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;