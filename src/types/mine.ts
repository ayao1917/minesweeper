export interface MineGridData {
  row: number; // Position row of a grid
  column: number; // Position column of a grid
  adjacent: number; // How many mines around
  isMine: boolean; // Is this grid contains a mine
  isReveal: boolean; // Has already reveal by user
  isFlag: boolean; // Is marked as flag by user
  isExplode: boolean; // A mine is triggered by user
}
