import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, BookStatus } from '../types';
import BookCard from '../components/BookCard';
import { Bookmark, BookOpen, CheckSquare, Search, X } from 'lucide-react';

const BooksPage: React.FC = () => {
  const { books } = useApp();
  const [activeTab, setActiveTab] = useState<BookStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBooks = books.filter(book => {
    const matchesTab = activeTab === 'all' || book.status === activeTab;
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  const statusCounts = {
    all: books.length,
    wishlist: books.filter(b => b.status === 'wishlist').length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Books</h1>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by title or author..."
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 inline-flex items-center ${
              activeTab === 'reading'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen size={16} className={activeTab === 'reading' ? 'text-indigo-500 mr-2' : 'text-gray-400 mr-2'} />
            Reading ({statusCounts.reading})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 inline-flex items-center ${
              activeTab === 'wishlist'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bookmark size={16} className={activeTab === 'wishlist' ? 'text-indigo-500 mr-2' : 'text-gray-400 mr-2'} />
            Want to Read ({statusCounts.wishlist})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center ${
              activeTab === 'completed'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckSquare size={16} className={activeTab === 'completed' ? 'text-indigo-500 mr-2' : 'text-gray-400 mr-2'} />
            Completed ({statusCounts.completed})
          </button>
        </nav>
      </div>
      
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            {activeTab === 'all' && <Search size={24} className="text-gray-400" />}
            {activeTab === 'reading' && <BookOpen size={24} className="text-gray-400" />}
            {activeTab === 'wishlist' && <Bookmark size={24} className="text-gray-400" />}
            {activeTab === 'completed' && <CheckSquare size={24} className="text-gray-400" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? "No books match your search criteria."
              : activeTab === 'all' 
                ? "You haven't added any books yet."
                : activeTab === 'reading'
                  ? "You're not currently reading any books."
                  : activeTab === 'wishlist'
                    ? "You don't have any books in your wishlist."
                    : "You haven't completed any books yet."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => window.location.href = '/add-book'}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add a Book
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BooksPage;