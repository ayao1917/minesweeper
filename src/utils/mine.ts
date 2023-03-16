import type { MineGridData } from "../types/mine";

// Public functions

/**
 * Create a 2D array with type `MineGridData`
 * @param {number} maxWidth: Max width of the board
 * @param {number} maxHeight: Max height of the board
 * @param {number} mines: How many mines needs to be created
 * @param {number[]} exclude: Avoid create mine at this position, for as [row, column] 
 * @returns {MineGridData[][]} The 2D array of the grid data, check type `MineGridData`
 */
export function initialMap(
  maxWidth: number,
  maxHeight: number,
  mines: number,
  exclude?: number[], // [r, c]
): MineGridData[][] {
  const mineSet = generateRandomMines(maxWidth, maxHeight, mines, exclude);

  let output = Array.from(Array(maxHeight).keys()).map(row => {
    return Array.from(Array(maxWidth).keys()).map(column => {
      const gridData = {
        row,
        column,
        adjacent: -1,
        isMine: true,
        isReveal: false,
        isFlag: false,
        isExplode: false,
      };

      if (mineSet.has(`${row}-${column}`)) {
        return gridData;
      }

      return {
        ...gridData,
        adjacent: getAdjacentMineCount(row, column, mineSet),
        isMine: false,
      };
    });
  });

  return output;
}

/**
 * Set isReveal to true of target grid, if this grid's adjacent mine count is 0
 * Reveal the other 8 grid around it as well. Use recursive call to achived.
 * @param {number} row: Row of the grid
 * @param {number} column: Column of the grid
 * @param {number} gameData: The 2D array of the grid data, check type `MineGridData` 
 * @returns {MineGridData[][]} Updated grid data
 */
export function revealGrid(
  row: number,
  column: number,
  gameData: MineGridData[][],
): MineGridData[][] {
  // Return origin data if position is out of bound
  if (!gameData[row] || !gameData[row][column]) {
    return gameData;
  }

  const gridData = gameData[row][column];
  const { adjacent, isFlag, isReveal } = gridData;

  // Return origin data if the grid is already revealed or it is mark as flag
  if (isFlag || isReveal) {
    return gameData;
  } 
  
  gameData[row][column].isReveal = true;
  if (adjacent > 0) {
    // Reveal only current grid if the adjacent mine is not 0
    return gameData;
  } else {
    // Reveal other 8 grid around if the adjacent mine is 0
    const checkList = getAdjacentGridPosition(row, column);

    return checkList.reduce((acc, curr) => {
      return revealGrid(curr[0], curr[1], acc);
    }, gameData);
  }
}

/**
 * Set isReveal to other 8 grid around the target
 * @param {number} row: Row of the grid
 * @param {number} column: Column of the grid
 * @param {MineGridData[][]} gameData: The 2D array of the grid data, check type `MineGridData` 
 * @returns {MineGridData[][]} Updated grid data
 */
export function revealAdjacentGrid(
  row: number,
  column: number,
  gameData: MineGridData[][],
): MineGridData[][] {
  const checkList = getAdjacentGridPosition(row, column);
  return [...checkList.reduce((acc, curr) => {
    return revealGrid(curr[0], curr[1], acc);
  }, gameData)];
};

/**
 * Return how many flags exist around the target grid
 * @param {number} row: Row of the grid
 * @param {number} column: Column of the grid
 * @param {MineGridData[][]} gameData: The 2D array of the grid data, check type `MineGridData` 
 * @returns {number} Flag count
 */
export function getAdjacentFlagCount(
  row: number,
  column: number,
  gameData: MineGridData[][],
): number {
  const checkList = getAdjacentGridPosition(row, column);
  return checkList.reduce((acc, curr) => {
    const { isFlag } = gameData[curr[0]][curr[1]];
    return acc + (isFlag ? 1 : 0);
  }, 0);
}

/**
 * Set all the grid data's isReveal to True
 * @param {MineGridData[][]} gameData: The 2D array of the grid data, check type `MineGridData` 
 * @returns {MineGridData[][]} Updated grid data
 */
export function revealAll(
  gameData: MineGridData[][],
): MineGridData[][] {
  return gameData.map(dataRow => {
    return dataRow.map(dataGrid => ({
      ...dataGrid,
      isReveal: true,
    }));
  });
}

/**
 * Count the number of grid which haven't been revealed
 * @param {MineGridData[][]} gameData: The 2D array of the grid data, check type `MineGridData`
 * @returns {number} Number of not reveal grid
 */
export function getHiddenCount(
  gameData: MineGridData[][],
): number {
  return gameData.reduce((acc, dataRow) => {
    return acc + dataRow.reduce((acc, data) => {
      return acc + (data.isReveal ? 0 : 1);
    }, 0);
  }, 0);
}

/**
 * Check if there is any mines (not flagged) around the grid
 * @param {number} row: Row of the grid
 * @param {number} column: Column of the grid
 * @param {MineGridData[][]} gameData: The 2D array of the grid data, check type `MineGridData`
 * @returns {boolean} Has any mines around
 */
export function hasMinesAround(
  row: number,
  column: number,
  gameData: MineGridData[][],
): boolean {
  const checkList = getAdjacentGridPosition(row, column);
  return checkList.some(item => {
    const { isFlag, isMine } = gameData[item[0]][item[1]];
    return !isFlag && isMine;
  });
}

// Private functions

/**
 * This method returns a set of mine form as `row-column`
 * If the param `exclude` is added, the mine will not appear in that position
 * @param {number} maxWidth: Max width of the board
 * @param {number} maxHeight: Max height of the board
 * @param {number} mines: How many mines needs to be created
 * @param {number[]} exclude: Avoid create mine at this position, for as [row, column]
 * @returns {Set<string>} A set of `row-column`
 */
function generateRandomMines(
  maxWidth: number,
  maxHeight: number,
  mines: number,
  exclude?: number[],
): Set<string> {
  const numbers: Set<string> = new Set();
  const excludeKey = exclude ? `${exclude[0]}-${exclude[1]}` : "";

  while (numbers.size < mines) {
    const randomRow = Math.floor((Math.random() * 1000) + 1) % maxHeight;
    const randomColumn = Math.floor((Math.random() * 1000) + 1) % maxWidth;

    const key = `${randomRow}-${randomColumn}`;
    // Bypass duplicate position
    if (!numbers.has(key) && key !== excludeKey) {
      numbers.add(key);
    }
  }

  return numbers;
}

/**
 * Generate the number of a grid with a set of mines
 * @param {number} row: Row of the grid
 * @param {number} column: Column of the grid
 * @param {Set<string>} mineSet: A set contains the grid which has mine, form like `row-column`
 * @returns {number} : Count of the total mine in adjacent grid
 */
function getAdjacentMineCount(
  row: number,
  column: number,
  mineSet: Set<string>,
): number {
  const checkList = getAdjacentGridPosition(row, column);

  return checkList.reduce((acc, curr) => {
    return mineSet.has(`${curr[0]}-${curr[1]}`) ? acc + 1 : acc;
  }, 0);
}

/**
 * Get the 8 adjacent grid around the target grid as list
 * @param {number} row: Row of the grid
 * @param {number} column: Column of the grid
 * @returns {number[][]} List of the 8 grid around the target
 * 
 * Calculate the total amount of mines from adjacent grids
 * map[r - 1][c - 1] | map[r - 1][c] | map[r - 1][c + 1]
 * -------------------------------------------------------
 *   map[r][c - 1]   |    map[r][c]  |    map[r][c + 1]
 * -------------------------------------------------------
 * map[r + 1][c - 1] | map[r + 1][c] | map[r + 1][c + 1]
 */
function getAdjacentGridPosition(
  row: number,
  column: number,
): number[][] {
  return [
    [row - 1, column - 1],
    [row - 1, column],
    [row - 1, column + 1],
    [row, column - 1],
    [row, column + 1],
    [row + 1, column - 1],
    [row + 1, column],
    [row + 1, column + 1],
  ];
}
