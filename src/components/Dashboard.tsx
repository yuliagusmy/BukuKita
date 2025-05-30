import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Book, Calendar, Award, TrendingUp } from 'lucide-react';
import ReadingCalendar from './ReadingCalendar';
import BookCard from './BookCard';
import { format, subDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const { books, userStats, dailyReadings, badges } = useApp();
  
  const currentlyReadingBooks = books.filter(book => book.status === 'reading');
  const recentlyCompletedBooks = books
    .filter(book => book.status === 'completed')
    .sort((a, b) => new Date(b.completedDate || 0).getTime() - new Date(a.completedDate || 0).getTime())
    .slice(0, 3);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayReading = dailyReadings.find(reading => reading.date === today);
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const yesterdayReading = dailyReadings.find(reading => reading.date === yesterday);

  const recentBadges = [...badges]
    .sort((a, b) => new Date(b.earnedDate || 0).getTime() - new Date(a.earnedDate || 0).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Welcome back!</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Book className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Reading Now</p>
              <p className="text-2xl font-bold text-gray-900">{currentlyReadingBooks.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Award className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.booksCompleted}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.readingStreak} days</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Reading</p>
              <p className="text-2xl font-bold text-gray-900">{todayReading?.pagesRead || 0} pages</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reading Calendar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading Activity</h2>
        <ReadingCalendar readings={dailyReadings} />
      </div>

      {/* Current Books */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Currently Reading</h2>
        {currentlyReadingBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyReadingBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">You're not reading any books right now.</p>
            <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
              Add a book
            </button>
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      {recentBadges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBadges.map(badge => (
              <motion.div 
                key={badge.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="p-2 bg-amber-50 rounded-full">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Completed */}
      {recentlyCompletedBooks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyCompletedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;