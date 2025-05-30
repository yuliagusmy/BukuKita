import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, TrendingUp, BookOpen, Award, Calendar } from 'lucide-react';

const StatsPage: React.FC = () => {
  const { books, readingSessions, userStats, dailyReadings } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Calculate genre stats
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.status === 'completed') {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });
  
  const topGenre = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .shift();
  
  // Calculate reading days
  const daysWithReading = new Set(dailyReadings.map(r => r.date)).size;
  
  // Calculate average pages per day
  const averagePagesPerDay = daysWithReading > 0 
    ? Math.round(userStats.totalPagesRead / daysWithReading) 
    : 0;
  
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
  
  // Get the day with most pages read
  const dayWithMostPages = [...dailyReadings]
    .sort((a, b) => b.pagesRead - a.pagesRead)
    .shift();
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Reading Statistics</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Books Completed</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.booksCompleted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Award className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Top Genre</p>
              <p className="text-2xl font-bold text-gray-900">{topGenre ? topGenre[0] : 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Reading Days</p>
              <p className="text-2xl font-bold text-gray-900">{daysWithReading}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Pages/Day</p>
              <p className="text-2xl font-bold text-gray-900">{averagePagesPerDay}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Monthly Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Reading</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-700 font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              disabled={format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')}
            >
              <ChevronRight size={20} className={format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM') ? 'text-gray-300' : ''} />
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
      
      {/* Reading Highlights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading Highlights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dayWithMostPages && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-800 mb-2">Most Productive Day</h3>
              <p className="text-2xl font-bold text-indigo-900">
                {format(parseISO(dayWithMostPages.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-indigo-700">{dayWithMostPages.pagesRead} pages read</p>
            </div>
          )}
          
          {topGenre && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">Favorite Genre</h3>
              <p className="text-2xl font-bold text-green-900">{topGenre[0]}</p>
              <p className="text-green-700">{topGenre[1]} books completed</p>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Current Reading Streak</h3>
            <p className="text-2xl font-bold text-blue-900">{userStats.readingStreak} days</p>
            <p className="text-blue-700">Keep it going!</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Total Pages Read</h3>
            <p className="text-2xl font-bold text-purple-900">{userStats.totalPagesRead}</p>
            <p className="text-purple-700">Across all books</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;