import { addDays, addMonths, format, isSameMonth, startOfWeek, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { DailyReading } from '../types';

interface ReadingCalendarProps {
  readings: DailyReading[];
}

const ReadingCalendar: React.FC<ReadingCalendarProps> = ({ readings }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getColorByPagesRead = (pagesRead: number): string => {
    if (pagesRead === 0) return 'bg-gray-100';
    if (pagesRead < 10) return 'bg-green-100';
    if (pagesRead < 15) return 'bg-green-200';
    if (pagesRead < 20) return 'bg-green-300';
    return 'bg-green-500';
  };

  const renderCalendarDays = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startDate = startOfWeek(monthStart);
    const days = [];

    // Create array of week day headers
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayHeaders = weekDays.map(day => (
      <div key={`header-${day}`} className="text-center text-xs font-medium text-gray-500 py-1">
        {day}
      </div>
    ));

    // Add days
    let day = startDate;
    for (let i = 0; i < 42; i++) {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const readingData = readings.find(r => r.date === formattedDate);
      const pagesRead = readingData?.pagesRead || 0;

      days.push(
        <div
          key={i}
          className={`relative p-1 ${
            !isSameMonth(day, monthStart) ? 'opacity-30' : ''
          }`}
        >
          <div className="text-xs mb-1 text-center text-gray-600">
            {format(day, 'd')}
          </div>
          <div
            className={`h-4 w-full rounded-sm ${getColorByPagesRead(pagesRead)}`}
            title={`${pagesRead} pages read`}
          ></div>
        </div>
      );

      day = addDays(day, 1);
    }

    return [...dayHeaders, ...days];
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 min-w-[400px]">
        {renderCalendarDays()}
      </div>

      <div className="flex items-center justify-end mt-4 space-x-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
          <span>0</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
          <span>1-9</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
          <span>10-14</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
          <span>15-19</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>20+</span>
        </div>
      </div>
    </div>
  );
};

export default ReadingCalendar;