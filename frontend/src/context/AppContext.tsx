import { addDays, format, isToday, parseISO } from 'date-fns';
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { Badge, Book, DailyReading, Genre, ReadingSession, UserStats as UserStatsType } from '../types';
import { getAchievementBadges, getBadgeForGenreCount } from '../utils/badgeUtils';
import { calculateXpToNextLevel, getTitleForLevel } from '../utils/levelUtils';

interface AppContextType {
  books: Book[];
  readingSessions: ReadingSession[];
  userStats: UserStatsType;
  badges: Badge[];
  addBook: (book: Omit<Book, 'id' | 'addedDate' | 'currentPage'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  addReadingSession: (bookId: string, pagesRead: number) => void;
  dailyReadings: DailyReading[];
  genres: Genre[];
}

const BOOKS_STORAGE_KEY = 'bookquest-books';
const SESSIONS_STORAGE_KEY = 'bookquest-sessions';
const USER_STATS_STORAGE_KEY = 'bookquest-user-stats';
const BADGES_STORAGE_KEY = 'bookquest-badges';

const defaultUserStats: UserStatsType = {
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  title: 'Pustakawan Pemula',
  booksCompleted: 0,
  totalPagesRead: 0,
  readingStreak: 0,
  lastReadDate: undefined
};

const defaultGenres: Genre[] = [
  'Fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
  'Non-fiction', 'Biography', 'History', 'Self-help', 'Philosophy', 'Science', 'Business', 'Other'
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [userStats, setUserStats] = useState<UserStatsType>(defaultUserStats);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dailyReadings, setDailyReadings] = useState<DailyReading[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);
    const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    const storedUserStats = localStorage.getItem(USER_STATS_STORAGE_KEY);
    const storedBadges = localStorage.getItem(BADGES_STORAGE_KEY);

    if (storedBooks) setBooks(JSON.parse(storedBooks));
    if (storedSessions) setReadingSessions(JSON.parse(storedSessions));
    if (storedUserStats) setUserStats(JSON.parse(storedUserStats));
    if (storedBadges) setBadges(JSON.parse(storedBadges));
  }, []);

  // Calculate daily readings whenever reading sessions change
  useEffect(() => {
    const dailyMap = new Map<string, number>();

    readingSessions.forEach(session => {
      const date = session.date;
      const current = dailyMap.get(date) || 0;
      dailyMap.set(date, current + session.pagesRead);
    });

    const readings: DailyReading[] = Array.from(dailyMap.entries()).map(([date, pagesRead]) => ({
      date,
      pagesRead,
    }));

    setDailyReadings(readings);
  }, [readingSessions]);

  // Update localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(readingSessions));
  }, [readingSessions]);

  useEffect(() => {
    localStorage.setItem(USER_STATS_STORAGE_KEY, JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
  }, [badges]);

  // Update streak
  useEffect(() => {
    if (readingSessions.length === 0) return;

    // Sort sessions by date, newest first
    const sortedSessions = [...readingSessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latestSessionDate = sortedSessions[0].date;
    const latestDate = parseISO(latestSessionDate);

    // If the latest session is not today or yesterday, reset streak
    if (!isToday(latestDate) && latestDate < addDays(new Date(), -1)) {
      setUserStats(prev => ({
        ...prev,
        readingStreak: 0,
        lastReadDate: latestSessionDate
      }));
      return;
    }

    // Calculate streak
    let streak = 1;
    let currentDate = latestDate;

    for (let i = 1; i < sortedSessions.length; i++) {
      const sessionDate = parseISO(sortedSessions[i].date);
      const expectedDate = addDays(currentDate, -1);

      if (format(sessionDate, 'yyyy-MM-dd') === format(expectedDate, 'yyyy-MM-dd')) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    // Update streak if it's higher than current
    if (streak > userStats.readingStreak) {
      setUserStats(prev => ({
        ...prev,
        readingStreak: streak,
        lastReadDate: latestSessionDate
      }));

      // Check for streak achievements
      if (streak === 7) {
        addXp(50);
        toast.success('7-day streak achieved! +50 XP', {
          icon: '🔥',
          duration: 3000,
        });
      }
    }
  }, [readingSessions]);

  // Check for badges whenever books or reading stats change
  useEffect(() => {
    // Count books by genre
    const genreCounts = new Map<string, number>();

    books.forEach(book => {
      if (book.status === 'completed') {
        const count = genreCounts.get(book.genre) || 0;
        genreCounts.set(book.genre, count + 1);
      }
    });

    // Check for genre badges
    const newBadges: Badge[] = [];

    genreCounts.forEach((count, genre) => {
      const badge = getBadgeForGenreCount(genre, count);
      if (badge && !badges.some(b => b.id === badge.id)) {
        newBadges.push(badge);
      }
    });

    // Check for achievement badges
    const achievementBadges = getAchievementBadges(userStats, books, dailyReadings);
    achievementBadges.forEach(badge => {
      if (!badges.some(b => b.id === badge.id)) {
        newBadges.push(badge);
      }
    });

    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);

      // Show notification for new badges
      newBadges.forEach(badge => {
        toast.success(`New badge earned: ${badge.name}`, {
          icon: '🏆',
          duration: 3000,
        });
      });
    }
  }, [books, userStats, badges, dailyReadings]);

  const addXp = (amount: number) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      const xpToNextLevel = calculateXpToNextLevel(prev.level);

      // Check if leveled up
      if (newXp >= xpToNextLevel) {
        const newLevel = prev.level + 1;
        const title = getTitleForLevel(newLevel);

        // Show level up notification
        toast.success(`Level Up! You are now ${title}`, {
          icon: '⭐',
          duration: 4000,
        });

        return {
          ...prev,
          level: newLevel,
          xp: newXp - xpToNextLevel,
          xpToNextLevel: calculateXpToNextLevel(newLevel),
          title,
        };
      }

      return {
        ...prev,
        xp: newXp,
      };
    });
  };

  const addBook = (bookData: Omit<Book, 'id' | 'addedDate' | 'currentPage'>) => {
    const newBook: Book = {
      ...bookData,
      id: uuidv4(),
      addedDate: new Date().toISOString(),
      currentPage: 0,
    };

    setBooks(prev => [...prev, newBook]);
    toast.success(`Added "${newBook.title}" to your collection`);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(prev => {
      const bookIndex = prev.findIndex(book => book.id === updatedBook.id);

      if (bookIndex === -1) return prev;

      const oldBook = prev[bookIndex];
      const wasCompleted = oldBook.status !== 'completed' && updatedBook.status === 'completed';

      const newBooks = [...prev];
      newBooks[bookIndex] = {
        ...updatedBook,
        completedDate: wasCompleted ? new Date().toISOString() : updatedBook.completedDate,
      };

      // If book was completed, add XP and update stats
      if (wasCompleted) {
        // Add 100 XP bonus for completing a book
        addXp(100);

        setUserStats(prev => ({
          ...prev,
          booksCompleted: prev.booksCompleted + 1,
        }));

        toast.success(`Congratulations on finishing "${updatedBook.title}"! +100 XP`, {
          icon: '📚',
          duration: 4000,
        });
      }

      return newBooks;
    });
  };

  const deleteBook = (id: string) => {
    const book = books.find(book => book.id === id);

    if (book) {
      setBooks(prev => prev.filter(book => book.id !== id));
      toast.success(`Removed "${book.title}" from your collection`);
    }
  };

  const addReadingSession = (bookId: string, pagesRead: number) => {
    // Find the book
    const book = books.find(b => b.id === bookId);
    if (!book || book.status !== 'reading') return;

    // Calculate XP (5 XP per page)
    const xpEarned = pagesRead * 5;

    // Create new session
    const newSession: ReadingSession = {
      id: uuidv4(),
      bookId,
      date: format(new Date(), 'yyyy-MM-dd'),
      pagesRead,
      xpEarned,
    };

    // Update reading sessions
    setReadingSessions(prev => [...prev, newSession]);

    // Update book progress
    const newCurrentPage = Math.min(book.currentPage + pagesRead, book.totalPages);
    const updatedBook: Book = {
      ...book,
      currentPage: newCurrentPage,
      status: newCurrentPage >= book.totalPages ? 'completed' : 'reading',
    };

    updateBook(updatedBook);

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      totalPagesRead: prev.totalPagesRead + pagesRead,
    }));

    // Add XP
    addXp(xpEarned);

    // Show success message with a random motivational quote
    const quotes = [
      "Great progress today! Every page is a step forward.",
      "Reading is to the mind what exercise is to the body. Keep it up!",
      "The more that you read, the more things you will know.",
      "Books are a uniquely portable magic. You're doing great!",
      "Today's reading is tomorrow's wisdom. Well done!",
      "A reader lives a thousand lives before dying. Keep exploring!",
      "Reading is an exercise in empathy. You're growing daily!",
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    toast.success(`${randomQuote} +${xpEarned} XP`, { duration: 4000 });
  };

  return (
    <AppContext.Provider value={{
      books,
      readingSessions,
      userStats,
      badges,
      addBook,
      updateBook,
      deleteBook,
      addReadingSession,
      dailyReadings,
      genres: defaultGenres,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};