import { Bookmark, BookOpen, CheckSquare, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import BookCard from '../components/BookCard';
import { useApp } from '../context/AppContext';
import { BookStatus } from '../types';

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
    <div className="bg-[#E3F0FF] min-h-screen py-8 px-2 md:px-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-8">My Books</h1>
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-blue-300" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white placeholder-blue-200 text-blue-900"
            placeholder="Search by title or author..."
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-blue-300 hover:text-blue-500" />
            </button>
          )}
        </div>
      </div>
      <div className="mb-6 border-b border-blue-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-bold text-sm mr-8 ${
              activeTab === 'all'
                ? 'border-blue-400 text-blue-700 bg-[#B3D8FD] rounded-t-lg'
                : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={`py-4 px-1 border-b-2 font-bold text-sm mr-8 inline-flex items-center ${
              activeTab === 'reading'
                ? 'border-blue-400 text-blue-700 bg-[#B3D8FD] rounded-t-lg'
                : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'
            }`}
          >
            <BookOpen size={16} className={activeTab === 'reading' ? 'text-blue-500 mr-2' : 'text-blue-300 mr-2'} />
            Reading ({statusCounts.reading})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-4 px-1 border-b-2 font-bold text-sm mr-8 inline-flex items-center ${
              activeTab === 'wishlist'
                ? 'border-yellow-400 text-yellow-800 bg-[#FFF6D2] rounded-t-lg'
                : 'border-transparent text-yellow-600 hover:text-yellow-800 hover:border-yellow-200'
            }`}
          >
            <Bookmark size={16} className={activeTab === 'wishlist' ? 'text-yellow-500 mr-2' : 'text-yellow-300 mr-2'} />
            Want to Read ({statusCounts.wishlist})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-bold text-sm inline-flex items-center ${
              activeTab === 'completed'
                ? 'border-green-400 text-green-800 bg-[#D2F8E5] rounded-t-lg'
                : 'border-transparent text-green-600 hover:text-green-800 hover:border-green-200'
            }`}
          >
            <CheckSquare size={16} className={activeTab === 'completed' ? 'text-green-500 mr-2' : 'text-green-300 mr-2'} />
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            {activeTab === 'all' && <Search size={24} className="text-blue-300" />}
            {activeTab === 'reading' && <BookOpen size={24} className="text-blue-300" />}
            {activeTab === 'wishlist' && <Bookmark size={24} className="text-yellow-300" />}
            {activeTab === 'completed' && <CheckSquare size={24} className="text-green-300" />}
          </div>
          <h3 className="text-lg font-bold text-blue-900 mb-1">No books found</h3>
          <p className="text-blue-400 mb-4">
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
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600"
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