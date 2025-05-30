import { v4 as uuidv4 } from 'uuid';
import { Badge, Book, DailyReading, UserStats } from '../types';

/**
 * Get the appropriate badge for a genre based on the number of books completed
 */
export const getBadgeForGenreCount = (genre: string, count: number): Badge | null => {
  if (count < 1) return null;
  
  let tier = 0;
  let name = '';
  let description = '';
  
  if (count >= 30) {
    tier = 4;
  } else if (count >= 15) {
    tier = 3;
  } else if (count >= 5) {
    tier = 2;
  } else if (count >= 1) {
    tier = 1;
  }

  // Define badge names and descriptions based on genre and tier
  switch (genre) {
    case 'Fantasy':
      switch (tier) {
        case 1:
          name = 'Penjelajah Dunia Fantasi';
          description = 'Completed your first fantasy book';
          break;
        case 2:
          name = 'Pendekar Legenda Fantasi';
          description = 'Completed 5 fantasy books';
          break;
        case 3:
          name = 'Penguasa Alam Magis';
          description = 'Completed 15 fantasy books';
          break;
        case 4:
          name = 'Arsitek Dunia Khayalan';
          description = 'Completed 30 fantasy books';
          break;
      }
      break;
    case 'Philosophy':
      switch (tier) {
        case 1:
          name = 'Perenung Sunyi';
          description = 'Completed your first philosophy book';
          break;
        case 2:
          name = 'Penjelajah Akal';
          description = 'Completed 5 philosophy books';
          break;
        case 3:
          name = 'Filsuf Sejati';
          description = 'Completed 15 philosophy books';
          break;
        case 4:
          name = 'Arsitek Pemikiran Abadi';
          description = 'Completed 30 philosophy books';
          break;
      }
      break;
    case 'Self-help':
      switch (tier) {
        case 1:
          name = 'Pembentuk Diri Pemula';
          description = 'Completed your first self-improvement book';
          break;
        case 2:
          name = 'Pengembang Potensi';
          description = 'Completed 5 self-improvement books';
          break;
        case 3:
          name = 'Arsitek Diri Sejati';
          description = 'Completed 15 self-improvement books';
          break;
        case 4:
          name = 'Guru Transformasi Hidup';
          description = 'Completed 30 self-improvement books';
          break;
      }
      break;
    default:
      switch (tier) {
        case 1:
          name = `${genre} Novice`;
          description = `Completed your first ${genre.toLowerCase()} book`;
          break;
        case 2:
          name = `${genre} Explorer`;
          description = `Completed 5 ${genre.toLowerCase()} books`;
          break;
        case 3:
          name = `${genre} Master`;
          description = `Completed 15 ${genre.toLowerCase()} books`;
          break;
        case 4:
          name = `${genre} Virtuoso`;
          description = `Completed 30 ${genre.toLowerCase()} books`;
          break;
      }
  }

  if (!name) return null;

  return {
    id: `genre-${genre.toLowerCase()}-tier-${tier}`,
    name,
    description,
    imageUrl: `/badges/${genre.toLowerCase()}-${tier}.svg`,
    earnedDate: new Date().toISOString(),
    type: 'genre',
    category: genre,
    tier,
  };
};

/**
 * Get achievement badges based on user stats and reading activity
 */
export const getAchievementBadges = (
  userStats: UserStats,
  books: Book[],
  dailyReadings: DailyReading[]
): Badge[] => {
  const badges: Badge[] = [];
  const now = new Date().toISOString();

  // Marathon Reader - 7 day streak
  if (userStats.readingStreak >= 7) {
    badges.push({
      id: 'achievement-marathon-reader',
      name: 'Marathon Reader',
      description: 'Read books for 7 consecutive days',
      imageUrl: '/badges/marathon-reader.svg',
      earnedDate: now,
      type: 'achievement',
    });
  }

  // 1000 Pages
  if (userStats.totalPagesRead >= 1000) {
    badges.push({
      id: 'achievement-1000-pages',
      name: '1000 Pages!',
      description: 'Read a total of 1000 pages',
      imageUrl: '/badges/1000-pages.svg',
      earnedDate: now,
      type: 'achievement',
    });
  }

  // Multi-genre Master
  const completedGenres = new Set(
    books
      .filter(book => book.status === 'completed')
      .map(book => book.genre)
  );

  if (completedGenres.size >= 5) {
    badges.push({
      id: 'achievement-multigenre-master',
      name: 'Multi-genre Master',
      description: 'Completed books from 5 different genres',
      imageUrl: '/badges/multigenre-master.svg',
      earnedDate: now,
      type: 'achievement',
    });
  }

  // Level Up Maniac
  if (userStats.level >= 10) {
    badges.push({
      id: 'achievement-level-up-maniac',
      name: 'Level Up Maniac',
      description: 'Reached level 10',
      imageUrl: '/badges/level-up-maniac.svg',
      earnedDate: now,
      type: 'achievement',
    });
  }

  // Monthly Hero
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const daysReadThisMonth = dailyReadings
    .filter(reading => {
      const date = new Date(reading.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && reading.pagesRead > 0;
    })
    .length;

  if (daysReadThisMonth >= 20) {
    badges.push({
      id: `achievement-monthly-hero-${currentYear}-${currentMonth}`,
      name: 'Monthly Hero',
      description: 'Read books for at least 20 days in a month',
      imageUrl: '/badges/monthly-hero.svg',
      earnedDate: now,
      type: 'achievement',
    });
  }

  return badges;
};