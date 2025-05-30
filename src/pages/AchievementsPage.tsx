import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Star, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { calculateLevelProgress } from '../utils/levelUtils';
import { motion } from 'framer-motion';

const AchievementsPage: React.FC = () => {
  const { badges, userStats } = useApp();
  
  const levelProgress = calculateLevelProgress(userStats.xp, userStats.xpToNextLevel);
  
  // Group badges by type
  const genreBadges = badges.filter(badge => badge.type === 'genre');
  const achievementBadges = badges.filter(badge => badge.type === 'achievement');
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Achievements</h1>
      
      {/* User Level */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp size={32} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{userStats.title}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">Level {userStats.level}</span>
                <span>•</span>
                <span className="ml-2">{userStats.xp} / {userStats.xpToNextLevel} XP</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-indigo-600 hover:text-indigo-800">View Details</button>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full h-4 bg-gray-100 rounded-full">
            <motion.div 
              className="h-full bg-indigo-600 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
          </div>
          <div className="absolute top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
            <span>Current: Level {userStats.level}</span>
            <span>Next: Level {userStats.level + 1}</span>
          </div>
        </div>
      </motion.div>
      
      {/* Achievement Badges */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementBadges.length > 0 ? (
            achievementBadges.map(badge => (
              <motion.div 
                key={badge.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-3 bg-amber-50 rounded-full">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{badge.name}</h3>
                  <p className="text-sm text-gray-500">{badge.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Earned on {new Date(badge.earnedDate || '').toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Award size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No badges yet</h3>
              <p className="text-gray-500">
                Keep reading to earn achievement badges!
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Genre Badges */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Genre Badges</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genreBadges.length > 0 ? (
            genreBadges.map(badge => (
              <motion.div 
                key={badge.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-3 bg-blue-50 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{badge.name}</h3>
                  <p className="text-sm text-gray-500">{badge.description}</p>
                  <div className="flex mt-1">
                    {[...Array(badge.tier || 1)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <BookOpen size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No genre badges yet</h3>
              <p className="text-gray-500">
                Complete books in different genres to earn badges!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;