import { motion } from 'framer-motion';
import { Book, Calendar, Clock, Star, Trophy } from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';

const Profile: React.FC = () => {
  const { userStats, badges } = useApp();
  const level = userStats.level;

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userName = userData.name || 'Reader';
  const userPhoto = userData.picture || '/default-avatar.png';
  const userEmail = userData.email || '';

  return (
    <div className="space-y-8 bg-[#E3F0FF] min-h-screen py-8 px-2 md:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={userPhoto}
              alt={userName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Level {level}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-900">{userName}</h1>
            <p className="text-blue-700">{userEmail}</p>
            <p className="text-sm text-blue-600 mt-1">{userStats.title}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="bg-white p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-full shadow-md">
              <Book className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-700">Books Completed</p>
              <p className="text-2xl font-bold text-blue-900 drop-shadow">{userStats.booksCompleted}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-400 rounded-full shadow-md">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-800">Total XP</p>
              <p className="text-2xl font-bold text-yellow-900 drop-shadow">{userStats.xp}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-400 rounded-full shadow-md">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-pink-700">Reading Streak</p>
              <p className="text-2xl font-bold text-pink-900 drop-shadow">{userStats.readingStreak} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-400 rounded-full shadow-md">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-purple-700">Total Pages</p>
              <p className="text-2xl font-bold text-purple-900 drop-shadow">{userStats.totalPagesRead} pages</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.length > 0 ? (
            badges.map(badge => (
              <motion.div
                key={badge.id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-50 rounded-full">
                    <Trophy className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900">{badge.name}</p>
                    <p className="text-sm text-blue-700">{badge.description}</p>
                    <p className="text-xs text-blue-500 mt-1">
                      Earned on {new Date(badge.earnedDate || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
                <Trophy size={24} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-1">No achievements yet</h3>
              <p className="text-blue-700">
                Keep reading to earn achievements!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;