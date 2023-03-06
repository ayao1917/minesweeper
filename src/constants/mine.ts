export const DEFAULT_MAX_WIDTH = 10;
export const DEFAULT_MAX_HEIGHT = 10;
export const DEFAULT_MINE_COUNT = 10;

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
    columns: 9,
    mines: 10,
    rows: 9,
  },
  [GAME_LEVEL.MEDIUM]: {
    columns: 16,
    mines: 40,
    rows: 16,
  },
  [GAME_LEVEL.HARD]: {
    columns: 16,
    mines: 99,
    rows: 30,
  },
};
