import type { MineGridData } from "../types/mine";

export function initialMap(
  rows: number,
  columns: number,
  mines: number,
  exclude?: number[],
): MineGridData[][] {
  const mineSet = generateRandomMines(rows, columns, mines, exclude);

  let output = Array.from(Array(rows).keys()).map(row => {
    return Array.from(Array(columns).keys()).map(column => {
      if (mineSet.has(`${row}-${column}`)) {
        return {
          row,
          column,
          adjacent: -1,
          isMine: true,
          isReveal: false,
          isFlag: false,
        };
      }

      return {
        row,
        column,
        adjacent: getAdjacentMineCount(row, column, mineSet),
        isMine: false,
        isReveal: false,
        isFlag: false,
      };
    });
  });

  if (exclude) {
    output = revealGrid(exclude[0], exclude[1], output);
  }

  return output;
}

export function revealGrid(
  row: number,
  column: number,
  gameData: MineGridData[][],
): MineGridData[][] {
  if (!gameData[row] || !gameData[row][column]) {
    return gameData;
  }

  const gridData = gameData[row][column];
  const { adjacent, isFlag, isReveal } = gridData;

  if (isFlag || isReveal) {
    return gameData;
  } 
  
  gameData[row][column].isReveal = true;
  if (adjacent > 0) {
    return [...gameData];
  } else {
    const checkList = getCheckList(row, column);

    return [...checkList.reduce((acc, curr) => {
      return revealGrid(curr[0], curr[1], acc);
    }, gameData)];
  }
}

export function revealAdjacentGrid(
  row: number,
  column: number,
  gameData: MineGridData[][],
): MineGridData[][] {
  const gridData = gameData[row][column];
  const { adjacent, isFlag, isReveal } = gridData;
  const checkList = getCheckList(row, column);

  if (isFlag || !isReveal) {
    return gameData;
  }

  const totalFlag = checkList.reduce((acc, curr) => {
    const { isFlag } = gameData[curr[0]][curr[1]];
    return acc + (isFlag ? 1 : 0);
  }, 0);

  console.log(adjacent, totalFlag);

  if (adjacent === totalFlag) {
    return [...checkList.reduce((acc, curr) => {
      return revealGrid(curr[0], curr[1], acc);
    }, gameData)];
  }

  return gameData;
};

export function revealAll(
  gameData: MineGridData[][],
) {
  return gameData.map(dataRow => {
    return dataRow.map(dataGrid => ({
      ...dataGrid,
      isReveal: true,
    }));
  });
}

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
 * This method returns a set of mine form as `row-column`
 * If the param `exclude` is added, the mine will not appear in that position
 * @param maxRow 
 * @param maxColumn 
 * @param times 
 * @param exclude 
 * @returns 
 */
function generateRandomMines(
  maxRow: number,
  maxColumn: number,
  times: number,
  exclude?: number[],
): Set<string> {
  const numbers: Set<string> = new Set();
  const excludeKey = exclude ? `${exclude[0]}-${exclude[1]}` : "";

  while (numbers.size < times) {
    const randomRow = Math.floor((Math.random() * 1000) + 1) % maxRow;
    const randomColumn = Math.floor((Math.random() * 1000) + 1) % maxColumn;

    const key = `${randomRow}-${randomColumn}`;
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
 * 
 * Calculate the total amount of mines from adjacent grids
 * map[r - 1][c - 1] | map[r - 1][c] | map[r - 1][c + 1]
 * -------------------------------------------------------
 *   map[r][c - 1]   |    map[r][c]  |    map[r][c + 1]
 * -------------------------------------------------------
 * map[r + 1][c - 1] | map[r + 1][c] | map[r + 1][c + 1]
 */
function getAdjacentMineCount(
  row: number,
  column: number,
  mineSet: Set<string>,
): number {
  const checkList = getCheckList(row, column);

  return checkList.reduce((acc, curr) => {
    return mineSet.has(`${curr[0]}-${curr[1]}`) ? acc + 1 : acc;
  }, 0);
}

/**
 * Get the 8 adjacent grid around the target grid as list
 * @param row: Row of the grid
 * @param column: Column of the grid
 * @returns List of the 8 grid around the target
 */
function getCheckList(
  row: number,
  column: number,
) {
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
