import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { LogOut, BookOpen, Plus, BarChart3, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/blogs', label: 'All Blogs', icon: BookOpen },
    { path: '/add-blog', label: 'Add Blog', icon: Plus },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <BookOpen className="relative w-8 h-8 text-white p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg transform group-hover:scale-110 transition-all duration-200" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-200">
                BlogAdmin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active
                      ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 transform scale-105'
                      : 'text-purple-100 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-30 -z-10"></div>
                  )}
                  <Icon className={`w-4 h-4 transition-all duration-200 ${active ? 'text-white' : 'text-purple-300 group-hover:text-white group-hover:scale-110'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-purple-100 font-medium">
                {user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2.5 text-sm bg-red-500/20 text-red-200 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200 border border-red-400/30 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/25 group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 backdrop-blur-sm">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center space-x-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transform scale-102'
                        : 'text-purple-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-30 -z-10"></div>
                    )}
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-purple-300'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-white/20 pt-4 mt-4 mx-2">
                <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-purple-100 font-medium">
                    {user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 mt-2 text-sm bg-red-500/20 text-red-200 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200 border border-red-400/30 hover:border-red-400 w-full group"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;