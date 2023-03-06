import React, { useEffect, useState } from "react";
import styled from "styled-components";

import MineGameGrid from "./MineGameGrid";
import {
  GAME_LEVEL,
  GAME_STATUS,
  LEVEL_DATA,
} from "../constants/mine";
import {
  getHiddenCount,
  initialMap,
  revealAdjacentGrid,
  revealAll,
  revealGrid,
} from "../utils/mine";

import type { MineGridData, MineLevelData } from "../types/mine";

interface Props {
  className?: string;
}

const MineGameBoard = ({ className }: Props) => {
  const [gameLevel, setGameLevel] = useState(GAME_LEVEL.EASY);
  const [gameData, setGameData] = useState<MineGridData[][]>([]);
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PENDING);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const isGameOver = [GAME_STATUS.DEAD, GAME_STATUS.SUCCESS].includes(gameStatus);

  const { columns, mines, rows } = LEVEL_DATA[gameLevel];

  useEffect(() => {
    setGameData(() => {
      return initialMap(columns, rows, mines);
    });
  }, [gameLevel]);

  useEffect(() => {
    let interval: number | undefined;
    if (!isFirstClick) {
      interval = setInterval(() => {
        if (!isGameOver && !isFirstClick) {
          setTimer(prev => prev + 1);
        }
      }, 1000);
    }

    if (isGameOver) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isGameOver, isFirstClick]);

  const onClickGrid = (row: number, column: number) => {
    const grid = gameData[row][column];
    const { isFlag, isMine, isReveal } = grid;

    if (isFlag || isReveal || isGameOver) {
      return null;
    }

    let updateData = gameData;
    if (isMine) {
      if (isFirstClick) {
        // Prevent the first click on mine grid
        // Reset all mine exclude user click point
        updateData = initialMap(columns, rows, mines, [row, column]);
      } else {
        // Reveal all grid
        setGameStatus(GAME_STATUS.DEAD);
        updateData = revealAll(updateData);
      }
    } else {
      updateData = revealGrid(row, column, updateData);
    }

    if (getHiddenCount(updateData) === mines) {
      setGameStatus(GAME_STATUS.SUCCESS);
      updateData = revealAll(updateData);
      alert("Success!!");
    }

    if (isFirstClick) {
      setGameStatus(GAME_STATUS.PROGRESS);
      setIsFirstClick(false);
    }

    setGameData(updateData);
  };

  const onMarkFlag = (row: number, column: number) => {
    const grid = gameData[row][column];
    const { isFlag, isReveal } = grid;

    if (isReveal) {
      return null;
    }

    setFlagCount(prev => {
      return prev + (isFlag ? -1 : 1);
    });

    setGameData(prev => {
      prev[row][column].isFlag = !isFlag;
      return [...prev];
    });
  };

  const onSweepArea = (row: number, column: number) => {
    setGameData(prev => {
      return [...revealAdjacentGrid(row, column, prev)]
    });
  };

  const onClickReset = () => {
    setGameStatus(GAME_STATUS.PENDING);
    setIsFirstClick(true);
    setTimer(0);
    setGameData(() => {
      return initialMap(columns, rows, mines);
    });
  };

  const renderStatusButtonContent = () => {
    switch (gameStatus) {
      case GAME_STATUS.DEAD:
        return "😵";

      case GAME_STATUS.SUCCESS:
        return "😎";

      case GAME_STATUS.PENDING:
      case GAME_STATUS.PROGRESS:
      default:
        return "😊";
    }
  };

  const renderMineArea = () => {
    return (
      <div className="mineArea">
        {gameData.map(dataRow => (
          <div className="mineRow" key={`row-${dataRow[0].row}`}>
            {dataRow.map(dataGrid => (
              <MineGameGrid
                data={dataGrid}
                key={`${dataGrid.row}-${dataGrid.column}`}
                onClick={onClickGrid}
                onDoubleClick={onSweepArea}
                onRightClick={onMarkFlag}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderLevelButton = (level: number) => {
    let buttonText = "";
    switch (level) {
      case GAME_LEVEL.MEDIUM:
        buttonText = "Medium";
        break;

      case GAME_LEVEL.HARD:
        buttonText = "Hard";
        break;

      case GAME_LEVEL.EASY:
      default:
        buttonText = "Easy";
        break;
    }

    const buttonClassName = gameLevel === level ?
      "levelButton buttonActive" : "levelButton";

    return (
      <button
        className={buttonClassName}
        key={level}
        onClick={() => {
          setGameLevel(level);
        }}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className={className}>
      <h2 className="boardHeader">Mine Sweeper</h2>
      <div className="boardControlBar">
        {Object.values(GAME_LEVEL).map(renderLevelButton)}
      </div>
      <div className="boardStatusBar">
        <div className="numberBlock">
          {`${mines - flagCount}`.padStart(3, "0")}
        </div>
        <button
          className="statusButton"
          onClick={onClickReset}
        >
          {renderStatusButtonContent()}
        </button>
        <div className="numberBlock">
          {`${timer}`.padStart(3, "0")}
        </div>
      </div>
      {renderMineArea()}
    </div>
  );
};

const StyledMineGameBoard = styled(MineGameBoard)`
  background-color: #C2C2C2;
  padding: 24px;
  .boardHeader {
    text-align: center;
  }
  .boardControlBar {
    align-items: center;
    display: flex;
    margin-bottom: 12px;
    .levelButton {
      margin-right: 4px;
    }
    .buttonActive {
      background-color: #D3BFBF;
    }
  }
  .boardStatusBar {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    width: 100%;
    .numberBlock {
      background-color: #951616;
      color: #F92A2A;
      font-weight: 600;
      padding: 2px 4px;
    }
    .statusButton {
      background-color: #DAD7D1;
    }
  }
  .mineArea {
    display: flex;
    flex-direction: column;
    .mineRow {
      display: flex;
    }
  }
`;

export default StyledMineGameBoard;