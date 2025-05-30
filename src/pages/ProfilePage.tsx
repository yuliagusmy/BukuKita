import React from 'react';
import { useApp } from '../context/AppContext';
import { Book, BookOpen, Award, Bookmark, CheckSquare, Calendar } from 'lucide-react';
import { calculateLevelProgress } from '../utils/levelUtils';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { userStats, books, badges, dailyReadings } = useApp();
  
  const levelProgress = calculateLevelProgress(userStats.xp, userStats.xpToNextLevel);
  
  // Count books by status
  const wishlistCount = books.filter(book => book.status === 'wishlist').length;
  const readingCount = books.filter(book => book.status === 'reading').length;
  const completedCount = books.filter(book => book.status === 'completed').length;
  
  // Count genres
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
  });
  
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Get reading streak data
  const currentStreak = userStats.readingStreak;
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Profile</h1>
      
      {/* Level Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-1">{userStats.title}</h2>
              <p className="text-indigo-100">Level {userStats.level} Reader</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Award size={32} className="text-white" />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-indigo-100">XP: {userStats.xp} / {userStats.xpToNextLevel}</span>
              <span className="text-sm text-indigo-100">{levelProgress}%</span>
            </div>
            <div className="w-full h-3 bg-white bg-opacity-20 rounded-full">
              <motion.div 
                className="h-full bg-white rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{userStats.booksCompleted}</p>
              <p className="text-sm text-gray-500">Books Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{userStats.totalPagesRead}</p>
              <p className="text-sm text-gray-500">Pages Read</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{badges.length}</p>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reading Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen size={18} className="text-blue-500 mr-3" />
                <span className="text-gray-700">Reading</span>
              </div>
              <span className="text-lg font-medium text-gray-900">{readingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bookmark size={18} className="text-amber-500 mr-3" />
                <span className="text-gray-700">Want to Read</span>
              </div>
              <span className="text-lg font-medium text-gray-900">{wishlistCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckSquare size={18} className="text-green-500 mr-3" />
                <span className="text-gray-700">Completed</span>
              </div>
              <span className="text-lg font-medium text-gray-900">{completedCount}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Genres</h3>
          {topGenres.length > 0 ? (
            <div className="space-y-4">
              {topGenres.map(([genre, count], index) => (
                <div key={genre} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-amber-100 text-amber-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{genre}</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No books added yet
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reading Streak</h3>
          <div className="flex items-center justify-center h-24">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Calendar className="h-8 w-8 text-indigo-500 mr-2" />
                <span className="text-4xl font-bold text-indigo-600">{currentStreak}</span>
              </div>
              <p className="text-gray-500 mt-2">days in a row</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Badges */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges
              .sort((a, b) => new Date(b.earnedDate || 0).getTime() - new Date(a.earnedDate || 0).getTime())
              .slice(0, 6)
              .map(badge => (
                <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-amber-100">
                    <Award size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award size={32} className="mx-auto text-gray-300 mb-2" />
            <p>No achievements earned yet</p>
            <p className="text-sm">Keep reading to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;