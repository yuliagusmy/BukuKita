import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns';
import { motion } from 'framer-motion';
import { Award, Book, Calendar, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../context/AppContext';
import BookCard from './BookCard';

const Dashboard: React.FC = () => {
  const { books, userStats, dailyReadings, badges } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userName = userData.name || 'Reader';
  const userPhoto = userData.picture || '/default-avatar.png';

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

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Calculate chart data
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const chartData = daysInMonth.map(day => {
    const dateString = format(day, 'yyyy-MM-dd');
    const reading = dailyReadings.find(r => r.date === dateString);

    return {
      date: format(day, 'dd'),
      pages: reading ? reading.pagesRead : 0,
    };
  });

  return (
    <div className="space-y-8 bg-[#E3F0FF] min-h-screen py-8 px-2 md:px-8 rounded-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900 drop-shadow-md">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src={userPhoto}
              alt={userName}
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-blue-900">{userName}</p>
              <p className="text-xs text-blue-700">Welcome back!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="bg-[#B3D8FD] p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-full shadow-md">
              <Book className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-700">Reading Now</p>
              <p className="text-2xl font-bold text-blue-900 drop-shadow">{currentlyReadingBooks.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#FFF6D2] p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-400 rounded-full shadow-md">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-800">Completed</p>
              <p className="text-2xl font-bold text-yellow-900 drop-shadow">{userStats.booksCompleted}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#FFE0F3] p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-400 rounded-full shadow-md">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-pink-700">Streak</p>
              <p className="text-2xl font-bold text-pink-900 drop-shadow">{userStats.readingStreak} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#E6E6FF] p-6 rounded-3xl shadow-lg border border-transparent hover:shadow-xl transition-shadow"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-400 rounded-full shadow-md">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-purple-700">Today's Reading</p>
              <p className="text-2xl font-bold text-purple-900 drop-shadow">{todayReading?.pagesRead || 0} pages</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Books */}
      <div>
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Currently Reading</h2>
        {currentlyReadingBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyReadingBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-blue-700">You're not reading any books right now.</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold shadow-md hover:bg-blue-600 transition-all">
              Add a book
            </button>
          </div>
        )}
      </div>

      {/* Monthly Reading Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-blue-900">Monthly Reading</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-blue-700 font-bold">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
              disabled={format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')}
            >
              <ChevronRight size={20} className={format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM') ? 'text-blue-200' : ''} />
            </button>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => value === 0 ? '0' : `${value}`}
              />
              <Tooltip
                formatter={(value) => [`${value} pages`, 'Pages Read']}
                labelFormatter={(label) => `Day ${label}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar
                dataKey="pages"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                name="Pages Read"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentBadges.length > 0 ? (
            recentBadges.map(badge => (
              <motion.div
                key={badge.id}
                className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-3 hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="p-2 bg-amber-50 rounded-full">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-blue-900">{badge.name}</p>
                  <p className="text-sm text-blue-700">{badge.description}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    Earned on {new Date(badge.earnedDate || '').toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
                <Award size={24} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-1">No achievements yet</h3>
              <p className="text-blue-700">
                Keep reading to earn achievements!
              </p>
            </div>
          )}
        </div>
      </div>

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