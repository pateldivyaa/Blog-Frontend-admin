import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../utils/api';
import { Plus, Edit, Trash2, Search, BookOpen, User, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

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
    // Filter blogs based on search term
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
      console.error('Fetch blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }

    setDeleteLoading(blogId);
    try {
      await blogAPI.deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error('Delete blog error:', error);
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
      
      // Update the blog in the local state
      const updatedBlogs = blogs.map(blog => 
        blog._id === blogId 
          ? { ...blog, title: editForm.title, content: editForm.content }
          : blog
      );
      setBlogs(updatedBlogs);
      
      setEditingBlog(null);
      setEditForm({ title: '', content: '' });
      toast.success('Blog updated successfully');
    } catch (error) {
      toast.error('Failed to update blog');
      console.error('Update blog error:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
            <p className="text-gray-600 mt-2">Manage your blog posts</p>
          </div>
          
          <Link
            to="/add-blog"
            className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Blog</span>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Blog Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'} found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No blogs found' : 'No blogs yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by creating your first blog post'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/add-blog"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Blog</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Blog Image */}
             {blog.image ? (
  <img
    src={blog.image}   // ✅ already a full URL
    alt={blog.title}
    className="w-full h-48 object-cover"
  />
) : (
  <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <BookOpen className="w-12 h-12 text-blue-400" />
  </div>
)}


                {/* Blog Content */}
                <div className="p-6">
                  {editingBlog === blog._id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Blog title"
                      />
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Blog content"
                      />
                      
                      {/* Author (read-only in edit mode) */}
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span>{blog.author?.name || 'Unknown Author'}</span>
                      </div>

                      {/* Edit Actions */}
                      <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={handleCancelEdit}
                          disabled={updateLoading}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        
                        <button
                          onClick={() => handleUpdateBlog(blog._id)}
                          disabled={updateLoading}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
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
                    // View Mode
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {truncateText(blog.content)}
                      </p>

                      {/* Author */}
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <User className="w-4 h-4 mr-1" />
                        <span>{blog.author?.name || 'Unknown Author'}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            disabled={editingBlog !== null}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deleteLoading === blog._id || editingBlog !== null}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === blog._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;