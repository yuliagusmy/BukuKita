/**
 * Calculate XP required for the next level
 */
export const calculateXpToNextLevel = (currentLevel: number): number => {
  if (currentLevel <= 5) {
    return 100 + (currentLevel - 1) * 20; // 100, 120, 140, 160, 180
  } else if (currentLevel <= 10) {
    return 200 + (currentLevel - 6) * 20; // 200, 220, 240, 260, 280
  } else if (currentLevel <= 15) {
    return 300 + (currentLevel - 11) * 30; // 300, 330, 360, 390, 420
  } else if (currentLevel <= 20) {
    return 450 + (currentLevel - 16) * 40; // 450, 490, 530, 570, 610
  } else if (currentLevel <= 30) {
    return 650 + (currentLevel - 21) * 50; // 650, 700, 750, etc.
  } else if (currentLevel <= 40) {
    return 1150 + (currentLevel - 31) * 60; // 1150, 1210, etc.
  } else if (currentLevel <= 50) {
    return 1750 + (currentLevel - 41) * 70; // 1750, 1820, etc.
  } else if (currentLevel <= 70) {
    return 2450 + (currentLevel - 51) * 100; // 2450, 2550, etc.
  } else if (currentLevel <= 90) {
    return 4450 + (currentLevel - 71) * 150; // 4450, 4600, etc.
  } else {
    return 7450 + (currentLevel - 91) * 200; // 7450, 7650, etc.
  }
};

/**
 * Get the title for a specific level
 */
export const getTitleForLevel = (level: number): string => {
  if (level <= 5) {
    return `Pustakawan Pemula Lv.${level}`;
  } else if (level <= 10) {
    return `Penjelajah Halaman Lv.${level}`;
  } else if (level <= 15) {
    return `Penggali Ilmu Lv.${level}`;
  } else if (level <= 20) {
    return `Pencinta Buku Sejati Lv.${level}`;
  } else if (level <= 30) {
    return `Ahli Literasi Lv.${level}`;
  } else if (level <= 40) {
    return `Pemburu Cerita Lv.${level}`;
  } else if (level <= 50) {
    return `Cendekiawan Lv.${level}`;
  } else if (level <= 70) {
    return `Sang Guru Bacaan Lv.${level}`;
  } else if (level <= 90) {
    return `Penjaga Warisan Kata Lv.${level}`;
  } else {
    return `Legenda Literasi Lv.${level}`;
  }
};

/**
 * Calculate percentage progress to next level
 */
export const calculateLevelProgress = (xp: number, xpToNextLevel: number): number => {
  return Math.min(Math.floor((xp / xpToNextLevel) * 100), 100);
};