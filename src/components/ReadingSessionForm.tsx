import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ReadingSessionFormProps {
  bookId: string;
  onAddSession: (pagesRead: number) => void;
}

const ReadingSessionForm: React.FC<ReadingSessionFormProps> = ({ bookId, onAddSession }) => {
  const [pagesRead, setPagesRead] = useState<number>(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pagesRead > 0) {
      onAddSession(pagesRead);
      setPagesRead(0);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="pagesRead" className="block text-sm font-medium text-gray-700 mb-1">
            How many pages did you read today?
          </label>
          <input
            type="number"
            id="pagesRead"
            min={1}
            value={pagesRead || ''}
            onChange={(e) => setPagesRead(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Number of pages"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={pagesRead <= 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center"
          >
            <BookOpen size={18} className="mr-2" />
            Log Reading
          </button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-5 gap-2">
        {[5, 10, 15, 20, 25].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setPagesRead(value)}
            className={`px-2 py-1 rounded-md text-sm font-medium ${
              pagesRead === value
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {value} pages
          </button>
        ))}
      </div>
    </form>
  );
};

export default ReadingSessionForm;