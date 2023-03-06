export interface MineGridData {
  row: number;
  column: number;
  adjacent: number;
  isMine: boolean;
  isReveal: boolean;
  isFlag: boolean;
}

export interface MineLevelData {
  columns: number;
  mines: number;
  rows: number;
}
