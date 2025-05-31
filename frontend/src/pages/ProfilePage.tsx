import { motion } from 'framer-motion';
import { Award, Bookmark, BookOpen, Calendar, CheckSquare, LogOut, Star } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateLevelProgress } from '../utils/levelUtils';

const ProfilePage: React.FC = () => {
  const { userStats, books, badges, dailyReadings } = useApp();
  const navigate = useNavigate();

  // Ambil data user Google dari localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userName = userData.name || 'Reader';
  const userPhoto = userData.picture || '/default-avatar.png';
  const userEmail = userData.email || '';

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

  const genreBadges = badges.filter(badge => badge.type === 'genre');
  const achievementBadges = badges.filter(badge => badge.type === 'achievement');

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="bg-[#E3F0FF] min-h-screen py-8 px-2 md:px-8 rounded-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Your Profile</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition-colors"
        >
          <LogOut size={18} className="mr-1" />
          Logout
        </button>
      </div>

      {/* Level Card with User Info */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
        <div className="px-6 pt-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* User Info - pojok kiri atas */}
            <div className="flex items-center space-x-4 md:space-x-4 md:mr-8 md:self-start">
              <img
                src={userPhoto}
                alt={userName}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold text-blue-900 drop-shadow leading-tight">{userName}</h2>
                <p className="text-blue-700 text-sm leading-tight">{userEmail}</p>
              </div>
            </div>
            {/* Level Info */}
            <div className="flex-1 flex flex-col justify-center md:items-end mt-4 md:mt-0">
              <h2 className="text-3xl font-bold mb-1 text-blue-900 drop-shadow">{userStats.title}</h2>
              <p className="text-blue-700 mb-2">Level {userStats.level} Reader</p>
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-sm text-blue-700">XP: {userStats.xp} / {userStats.xpToNextLevel}</span>
                <span className="text-sm text-blue-700">{levelProgress}%</span>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center ml-2">
                  <Award size={28} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>
          {/* XP Bar full width */}
          <div className="w-full h-3 bg-blue-100 rounded-full mt-6">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            ></motion.div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">{userStats.booksCompleted}</p>
              <p className="text-sm text-blue-400">Books Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-700">{userStats.totalPagesRead}</p>
              <p className="text-sm text-purple-400">Pages Read</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-700">{badges.length}</p>
              <p className="text-sm text-yellow-500">Badges Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#B3D8FD] p-6 rounded-3xl shadow-lg">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Reading Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen size={18} className="text-blue-500 mr-3" />
                <span className="text-blue-700 font-bold">Reading</span>
              </div>
              <span className="text-lg font-bold text-blue-900">{readingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bookmark size={18} className="text-yellow-500 mr-3" />
                <span className="text-yellow-700 font-bold">Want to Read</span>
              </div>
              <span className="text-lg font-bold text-yellow-900">{wishlistCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckSquare size={18} className="text-green-500 mr-3" />
                <span className="text-green-700 font-bold">Completed</span>
              </div>
              <span className="text-lg font-bold text-green-900">{completedCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF6D2] p-6 rounded-3xl shadow-lg">
          <h3 className="text-lg font-bold text-yellow-800 mb-4">Top Genres</h3>
          {topGenres.length > 0 ? (
            <div className="space-y-4">
              {topGenres.map(([genre, count], index) => (
                <div key={genre} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-yellow-300 text-yellow-900 font-bold`}>
                      {index + 1}
                    </div>
                    <span className="text-yellow-900 font-bold">{genre}</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-900">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-yellow-400 font-bold">
              No books added yet
            </div>
          )}
        </div>

        <div className="bg-[#E6E6FF] p-6 rounded-3xl shadow-lg">
          <h3 className="text-lg font-bold text-purple-800 mb-4">Reading Streak</h3>
          <div className="flex items-center justify-center h-24">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Calendar className="h-8 w-8 text-purple-500 mr-2" />
                <span className="text-4xl font-bold text-purple-700">{currentStreak}</span>
              </div>
              <p className="text-purple-400 mt-2 font-bold">days in a row</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">Achievement Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementBadges.length > 0 ? (
            achievementBadges.map(badge => (
              <div
                key={badge.id}
                className="bg-yellow-50 p-4 rounded-xl shadow flex items-center space-x-4"
              >
                <div className="p-3 bg-amber-200 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-900">{badge.name}</h3>
                  <p className="text-sm text-yellow-700">{badge.description}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Earned on {new Date(badge.earnedDate || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-xl shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Award size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-yellow-900 mb-1">No badges yet</h3>
              <p className="text-yellow-700">
                Keep reading to earn achievement badges!
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Genre Badges */}
      <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
        <h3 className="text-lg font-bold text-blue-800 mb-4">Genre Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genreBadges.length > 0 ? (
            genreBadges.map(badge => (
              <div
                key={badge.id}
                className="bg-blue-50 p-4 rounded-xl shadow flex items-center space-x-4"
              >
                <div className="p-3 bg-blue-200 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                  <h3 className="font-bold text-blue-900">{badge.name}</h3>
                  <p className="text-sm text-blue-700">{badge.description}</p>
                  <div className="flex mt-1">
                    {[...Array(badge.tier || 1)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-xl shadow text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <BookOpen size={24} className="text-blue-400" />
          </div>
              <h3 className="text-lg font-bold text-blue-900 mb-1">No genre badges yet</h3>
              <p className="text-blue-700">
                Complete books in different genres to earn badges!
              </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;