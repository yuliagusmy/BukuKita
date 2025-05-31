export type BookStatus = 'wishlist' | 'reading' | 'completed';

export type Genre =
  | 'Fiction'
  | 'Fantasy'
  | 'Science Fiction'
  | 'Mystery'
  | 'Thriller'
  | 'Romance'
  | 'Non-fiction'
  | 'Biography'
  | 'History'
  | 'Self-help'
  | 'Philosophy'
  | 'Science'
  | 'Business'
  | 'Other';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  addedDate: string;
  completedDate?: string;
  notes?: string;
  rating?: number;
  color?: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  date: string;
  pagesRead: number;
  xpEarned: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
  booksCompleted: number;
  totalPagesRead: number;
  readingStreak: number;
  lastReadDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedDate?: string;
  type: 'genre' | 'achievement';
  category?: string;
  tier?: number;
}

export interface DailyReading {
  date: string;
  pagesRead: number;
}