export const GAME_STATUS = {
  PENDING: 0,
  PROGRESS: 1,
  DEAD: 2,
  SUCCESS: 3,
};

export const GAME_LEVEL = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2,
};

export const LEVEL_DATA = {
  [GAME_LEVEL.EASY]: {
    maxHeight: 9,
    maxWidth: 9,
    mines: 10,
  },
  [GAME_LEVEL.MEDIUM]: {
    maxHeight: 16,
    maxWidth: 16,
    mines: 40,
  },
  [GAME_LEVEL.HARD]: {
    maxHeight: 16,
    maxWidth: 30,
    mines: 99,
  },
};
