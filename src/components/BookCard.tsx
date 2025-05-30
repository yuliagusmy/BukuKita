import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book as BookType } from '../types';
import { Book, BookOpen, Check, Clock, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: BookType;
}

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
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={handleClick}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-70" />
        <div className="pt-6 px-6 relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white truncate max-w-[80%]">{book.title}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </span>
          </div>
          <p className="text-sm text-white text-opacity-90 mb-2">{book.author}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-500">{book.genre}</span>
          <span className="text-xs text-gray-500">{book.totalPages} pages</span>
        </div>
        
        {book.status === 'reading' && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs text-gray-500">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-indigo-500 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Page {book.currentPage}</span>
              <span>{book.totalPages - book.currentPage} pages left</span>
            </div>
          </div>
        )}
        
        {book.status === 'completed' && (
          <div className="mt-3 flex items-center justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
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