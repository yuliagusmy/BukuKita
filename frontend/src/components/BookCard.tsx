import { motion } from 'framer-motion';
import { Book, Bookmark, BookOpen, Check } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book as BookType, Genre } from '../types';

interface BookCardProps {
  book: BookType;
}

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

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (book.status) {
      case 'wishlist':
        return <Bookmark size={16} className="text-amber-500" />;
      case 'reading':
        return <BookOpen size={16} className="text-blue-500" />;
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      default:
        return <Book size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (book.status) {
      case 'wishlist':
        return 'Want to Read';
      case 'reading':
        return 'Currently Reading';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const progressPercent = book.totalPages > 0
    ? Math.round((book.currentPage / book.totalPages) * 100)
    : 0;

  const handleClick = () => {
    navigate(`/book/${book.id}`);
  };

  // Helper untuk background card
  const cardBgStyle = book.color ? { backgroundColor: book.color } : undefined;
  const headerBgStyle = book.color ? { backgroundColor: book.color, opacity: 0.8 } : undefined;

  const getCardBg = () => {
    if (book.color) return '';
    switch (book.status) {
      case 'wishlist':
        return 'bg-[#FFF6D2]';
      case 'reading':
        return 'bg-[#B3D8FD]';
      case 'completed':
        return 'bg-[#D2F8E5]';
      default:
        return 'bg-white';
    }
  };

  const getHeaderBg = () => {
    if (book.color) return '';
    switch (book.status) {
      case 'wishlist':
        return 'bg-yellow-200';
      case 'reading':
        return 'bg-blue-200';
      case 'completed':
        return 'bg-green-200';
      default:
        return 'bg-gray-100';
    }
  };

  const getTitleColor = () => {
    switch (book.status) {
      case 'wishlist':
        return 'text-yellow-900';
      case 'reading':
        return 'text-blue-900';
      case 'completed':
        return 'text-green-900';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <motion.div
      className={`${getCardBg()} rounded-xl shadow-md border border-transparent overflow-hidden hover:shadow-lg transition-shadow`}
      style={cardBgStyle}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={handleClick}
    >
      <div className={`relative pt-6 px-6 pb-2 ${getHeaderBg()}`}
        style={headerBgStyle}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold truncate max-w-[80%] ${getTitleColor()}`}>{book.title}</h3>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-white bg-opacity-60 text-gray-700">
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </span>
        </div>
        <p className="text-sm text-gray-700 text-opacity-90 mb-2">{book.author}</p>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold mt-1" style={{ backgroundColor: genreColors[book.genre], color: '#22223B' }}>{book.genre}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-500">{book.genre}</span>
          <span className="text-xs text-gray-500">{book.totalPages} pages</span>
        </div>
        {book.status === 'reading' && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-blue-700">Progress</span>
              <span className="text-xs text-blue-500">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-blue-100 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-blue-400">
              <span>Page {book.currentPage}</span>
              <span>{book.totalPages - book.currentPage} pages left</span>
            </div>
          </div>
        )}
        {book.status === 'completed' && (
          <div className="mt-3 flex items-center justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
              <Check size={14} className="mr-1" />
              Completed
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;