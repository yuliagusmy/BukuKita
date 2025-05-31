import { Book as BookIcon, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookStatus, Genre } from '../types';

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

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { addBook, genres } = useApp();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<Genre>('Fiction');
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<BookStatus>('wishlist');
  const [color, setColor] = useState<string>('#B3D8FD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !genre || totalPages <= 0) {
      alert('Please fill in all required fields.');
      return;
    }

    addBook({
      title,
      author,
      genre,
      totalPages,
      status,
      color,
    });

    navigate('/books');
  };

  return (
    <div className="bg-[#E3F0FF] min-h-screen py-8 px-2 md:px-8 rounded-3xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-8">Add a New Book</h1>
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter book title"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as Genre)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  required
                >
                  <option value="">Select genre</option>
                  {genres.map(g => (
                    <option key={g} value={g} style={{ backgroundColor: genreColors[g], color: '#22223B' }}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Pages <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="totalPages"
                  min={1}
                  value={totalPages || ''}
                  onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter total pages"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Status
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setStatus('wishlist')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium ${
                    status === 'wishlist'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BookIcon size={18} className={status === 'wishlist' ? 'text-amber-500 mr-2' : 'text-gray-400 mr-2'} />
                  Want to Read
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('reading')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium ${
                    status === 'reading'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BookIcon size={18} className={status === 'reading' ? 'text-blue-500 mr-2' : 'text-gray-400 mr-2'} />
                  Currently Reading
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('completed')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium ${
                    status === 'completed'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BookIcon size={18} className={status === 'completed' ? 'text-green-500 mr-2' : 'text-gray-400 mr-2'} />
                  Completed
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Card Color
              </label>
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 p-0 border-0 bg-transparent cursor-pointer"
                title="Pick card color"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 font-bold transition-all"
            >
              <Plus size={18} className="mr-2" />
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;