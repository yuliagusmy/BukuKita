import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book as BookIcon, Edit, Trash, Star, ArrowLeft, BookOpen, Bookmark, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { BookStatus, Book } from '../types';
import ReadingSessionForm from '../components/ReadingSessionForm';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, updateBook, deleteBook, addReadingSession } = useApp();
  
  const book = books.find(b => b.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState<Book | null>(book || null);
  
  if (!book) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
        <button 
          onClick={() => navigate('/books')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Books
        </button>
      </div>
    );
  }
  
  const progressPercent = book.totalPages > 0 
    ? Math.round((book.currentPage / book.totalPages) * 100) 
    : 0;
  
  const handleStatusChange = (newStatus: BookStatus) => {
    const updatedBook = { ...book, status: newStatus };
    updateBook(updatedBook);
  };
  
  const handleDeleteBook = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(book.id);
      navigate('/books');
    }
  };
  
  const handleSaveEdit = () => {
    if (editedBook) {
      updateBook(editedBook);
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditedBook(book);
    setIsEditing(false);
  };
  
  const handleAddReadingSession = (pagesRead: number) => {
    addReadingSession(book.id, pagesRead);
  };
  
  const renderEditForm = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Book</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={editedBook?.title || ''}
            onChange={e => setEditedBook(prev => prev ? { ...prev, title: e.target.value } : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            value={editedBook?.author || ''}
            onChange={e => setEditedBook(prev => prev ? { ...prev, author: e.target.value } : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              value={editedBook?.genre || ''}
              onChange={e => setEditedBook(prev => prev ? { ...prev, genre: e.target.value as any } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select genre...</option>
              <option value="Fiction">Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Non-fiction">Non-fiction</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-help">Self-help</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Science">Science</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Pages</label>
            <input
              type="number"
              value={editedBook?.totalPages || 0}
              onChange={e => setEditedBook(prev => prev ? { ...prev, totalPages: parseInt(e.target.value) } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Page</label>
          <input
            type="number"
            value={editedBook?.currentPage || 0}
            onChange={e => setEditedBook(prev => prev ? { ...prev, currentPage: parseInt(e.target.value) } : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={editedBook?.status || ''}
            onChange={e => setEditedBook(prev => prev ? { ...prev, status: e.target.value as BookStatus } : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="wishlist">Want to Read</option>
            <option value="reading">Currently Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        {editedBook?.status === 'completed' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={editedBook?.notes || ''}
              onChange={e => setEditedBook(prev => prev ? { ...prev, notes: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-24"
              placeholder="Your thoughts and insights about this book..."
            />
          </div>
        )}
        
        {editedBook?.status === 'completed' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setEditedBook(prev => prev ? { ...prev, rating } : null)}
                  className="text-2xl"
                >
                  <Star 
                    size={24} 
                    className={editedBook?.rating && editedBook.rating >= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                  />
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/books')}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Book Details</h1>
      </div>
      
      {isEditing ? (
        renderEditForm()
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-500 to-purple-600" />
              <div className="pt-8 px-8 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{book.title}</h2>
                    <p className="text-white text-opacity-90">by {book.author}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={handleDeleteBook}
                      className="p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <BookIcon size={18} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{book.genre}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{book.totalPages} pages</span>
                </div>
                <div className="flex items-center space-x-2">
                  {book.status === 'wishlist' && <Bookmark size={18} className="text-amber-500" />}
                  {book.status === 'reading' && <BookOpen size={18} className="text-blue-500" />}
                  {book.status === 'completed' && <CheckSquare size={18} className="text-green-500" />}
                  <span className="text-sm font-medium text-gray-900">
                    {book.status === 'wishlist' && 'Want to Read'}
                    {book.status === 'reading' && 'Currently Reading'}
                    {book.status === 'completed' && 'Completed'}
                  </span>
                </div>
              </div>
              
              {book.status === 'reading' && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Reading Progress</h3>
                    <span className="text-sm font-medium text-indigo-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full">
                    <motion.div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${progressPercent}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Page {book.currentPage}</span>
                    <span>{book.totalPages - book.currentPage} pages left</span>
                  </div>
                </div>
              )}
              
              {book.status === 'completed' && book.rating && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Rating</h3>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Star 
                        key={rating}
                        size={24} 
                        className={book.rating && book.rating >= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {book.status === 'completed' && book.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                    {book.notes}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex flex-wrap gap-2">
                {book.status !== 'wishlist' && (
                  <button
                    onClick={() => handleStatusChange('wishlist')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Bookmark size={16} className="mr-2 text-amber-500" />
                    Move to Wishlist
                  </button>
                )}
                
                {book.status !== 'reading' && (
                  <button
                    onClick={() => handleStatusChange('reading')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <BookOpen size={16} className="mr-2 text-blue-500" />
                    Start Reading
                  </button>
                )}
                
                {book.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CheckSquare size={16} className="mr-2 text-green-500" />
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {book.status === 'reading' && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Track Your Reading</h3>
              <ReadingSessionForm bookId={book.id} onAddSession={handleAddReadingSession} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookDetailPage;