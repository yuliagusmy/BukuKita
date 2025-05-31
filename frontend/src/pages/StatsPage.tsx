import { addMonths, eachDayOfInterval, endOfMonth, format, parseISO, startOfMonth, subMonths } from 'date-fns';
import { Award, BookOpen, Calendar, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ReadingCalendar from '../components/ReadingCalendar';
import { useApp } from '../context/AppContext';
import { Genre } from '../types';

const genreColors: Record<Genre, string> = {
  Fiction: '#FFB6C1',
  Fantasy: '#B39DDB',
  'Science Fiction': '#81D4FA',
  Mystery: '#FFD54F',
  Thriller: '#FF8A65',
  Romance: '#F06292',
  'Non-fiction': '#A5D6A7',
  Biography: '#90CAF9',
  History: '#CE93D8',
  'Self-help': '#FFF176',
  Philosophy: '#B0BEC5',
  Science: '#4FC3F7',
  Business: '#FFD180',
  Other: '#E0E0E0',
};

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
    <div className="bg-[#E3F0FF] min-h-screen py-8 px-2 md:px-8 rounded-3xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-8">Reading Statistics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#B3D8FD] p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-700">Books Completed</p>
              <p className="text-2xl font-bold text-blue-900">{userStats.booksCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFF6D2] p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-400 rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-800">Top Genre</p>
              <p className="text-2xl font-bold text-yellow-900">
                {topGenre ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: genreColors[topGenre[0] as Genre], color: '#22223B' }}>{topGenre[0]}</span>
                ) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFE0F3] p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-400 rounded-full">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-pink-700">Reading Days</p>
              <p className="text-2xl font-bold text-pink-900">{daysWithReading}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#E6E6FF] p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-400 rounded-full">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-purple-700">Avg. Pages/Day</p>
              <p className="text-2xl font-bold text-purple-900">{averagePagesPerDay}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
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

      {/* Reading Activity Calendar */}
      <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Reading Activity</h2>
        <ReadingCalendar readings={dailyReadings} />
      </div>

      {/* Reading Highlights */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Reading Highlights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dayWithMostPages && (
            <div className="bg-blue-100 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-blue-800 mb-2">Most Productive Day</h3>
              <p className="text-2xl font-bold text-blue-900">
                {format(parseISO(dayWithMostPages.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-blue-700">{dayWithMostPages.pagesRead} pages read</p>
            </div>
          )}

          {topGenre && (
            <div className="bg-yellow-100 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-yellow-800 mb-2">Favorite Genre</h3>
              <p className="text-2xl font-bold" style={{ backgroundColor: genreColors[topGenre[0] as Genre], color: '#22223B', borderRadius: '999px', display: 'inline-block', padding: '0.25em 1em' }}>{topGenre[0]}</p>
              <p className="text-yellow-700">{topGenre[1]} books completed</p>
            </div>
          )}

          <div className="bg-pink-100 p-4 rounded-xl">
            <h3 className="text-sm font-bold text-pink-800 mb-2">Current Reading Streak</h3>
            <p className="text-2xl font-bold text-pink-900">{userStats.readingStreak} days</p>
            <p className="text-pink-700">Keep it going!</p>
          </div>

          <div className="bg-purple-100 p-4 rounded-xl">
            <h3 className="text-sm font-bold text-purple-800 mb-2">Total Pages Read</h3>
            <p className="text-2xl font-bold text-purple-900">{userStats.totalPagesRead}</p>
            <p className="text-purple-700">Across all books</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;