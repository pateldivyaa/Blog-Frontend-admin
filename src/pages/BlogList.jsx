import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../utils/api';
import { Plus, Edit, Trash2, Search, BookOpen, User, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.author?.name && blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getBlogs();
      setBlogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) return;
    setDeleteLoading(blogId);
    try {
      await blogAPI.deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog._id);
    setEditForm({ title: blog.title, content: blog.content });
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setEditForm({ title: '', content: '' });
  };

  const handleUpdateBlog = async (blogId) => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setUpdateLoading(true);
    try {
      await blogAPI.updateBlog(blogId, editForm);
      const updatedBlogs = blogs.map(blog =>
        blog._id === blogId ? { ...blog, title: editForm.title, content: editForm.content } : blog
      );
      setBlogs(updatedBlogs);
      setEditingBlog(null);
      setEditForm({ title: '', content: '' });
      toast.success('Blog updated successfully');
    } catch (error) {
      toast.error('Failed to update blog');
    } finally {
      setUpdateLoading(false);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              All Blogs
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Explore and manage your blog posts</p>
          </div>

          <Link
            to="/add-blog"
            className="relative mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">New Blog</span>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl shadow-md bg-white/70 backdrop-blur border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Blog Count */}
        <p className="text-sm text-gray-600 mb-6">
          {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl  shadow-md border border-gray-200">
            <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No blogs found' : 'No blogs yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first blog post'}
            </p>
            {!searchTerm && (
              <Link
                to="/add-blog"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Create Blog</span>
              </Link>
            )}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.04] transition-all duration-300"
              >
                {/* Blog Image */}
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="w-14 h-14 text-purple-400" />
                  </div>
                )}

                {/* Blog Content */}
                <div className="p-6 ">
                  {editingBlog === blog._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500"
                        placeholder="Blog title"
                      />
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Blog content"
                      />

                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span>{blog.author?.name || 'Unknown Author'}</span>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={handleCancelEdit}
                          disabled={updateLoading}
                          className="flex items-center space-x-1 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>

                        <button
                          onClick={() => handleUpdateBlog(blog._id)}
                          disabled={updateLoading}
                          className="flex items-center space-x-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 rounded-lg transition disabled:opacity-50"
                        >
                          {updateLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {truncateText(blog.content)}
                  </p>
                </div>

                    

 <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl ">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Written by</p>
                    <p className="text-base font-bold text-gray-900">{blog.author?.name || 'Unknown Author'}</p>
                  </div>
                </div>
                      <div className="flex justify-center space-x-4 pt-6">
                  <button
                    onClick={() => handleEdit(blog)}
                    disabled={editingBlog !== null}
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Post</span>
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id, blog.title)}
                    disabled={deleteLoading === blog._id || editingBlog !== null}
                    className="flex items-center space-x-2 px-8 py-3 text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {deleteLoading === blog._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    <span>Delete Post</span>
                  </button>
                </div>
                 </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
