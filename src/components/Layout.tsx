import { motion } from 'framer-motion';
import { BarChart2, BookOpen, BookPlus, LayoutDashboard, UserCircle } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateLevelProgress } from '../utils/levelUtils';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { userStats } = useApp();

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/books', icon: <BookOpen size={20} />, label: 'My Books' },
    { path: '/add-book', icon: <BookPlus size={20} />, label: 'Add Book' },
    { path: '/stats', icon: <BarChart2 size={20} />, label: 'Statistics' },
    { path: '/profile', icon: <UserCircle size={20} />, label: 'Profile' },
  ];

  const levelProgress = calculateLevelProgress(userStats.xp, userStats.xpToNextLevel);

  return (
    <div className="min-h-screen bg-[#E3F0FF] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm py-4 px-4 flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold text-blue-900">BookQuest</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-blue-700">Lv.{userStats.level}</span>
          <div className="w-20 h-2 bg-blue-100 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white shadow-lg overflow-y-auto">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-blue-900">BookQuest</h1>
          </div>
          <div className="px-4 py-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-900">{userStats.title}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
                  {userStats.xp}/{userStats.xpToNextLevel} XP
                </span>
              </div>
              <div className="w-full h-2 bg-blue-100 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-bold rounded-md group transition-colors relative ${
                      isActive
                        ? 'text-blue-900 bg-blue-100'
                        : 'text-blue-500 hover:bg-blue-50 hover:text-blue-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-700 rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
        <div className="flex justify-around">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            // Only show 5 items in mobile nav
            if (index > 4) return null;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-1 flex-col items-center py-3 text-xs font-bold ${
                  isActive ? 'text-blue-900' : 'text-blue-500'
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute top-0 w-full h-0.5 bg-blue-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;