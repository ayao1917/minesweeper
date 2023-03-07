import classNames from "classnames";
import React from "react";
import styled from "styled-components";

import type { MineGridData } from "../types/mine";

interface Props {
  className?: string;
  data: MineGridData;
  onClick: (row: number, column: number) => void;
  onDoubleClick: (row: number, column: number) => void;
  onRightClick: (row: number, column: number) => void;
}

const MineGameGrid = ({
  className,
  data,
  onClick,
  onDoubleClick,
  onRightClick,
}: Props) => {
  const { row, column, adjacent, isFlag, isMine, isReveal, isExplode } = data;
  const buttonContentClassName = classNames("buttonContent", {
    buttonExplode: isReveal && isExplode,
    buttonReveal: isReveal && !isExplode,
    adjacentOne: adjacent === 1,
    adjacentTwo: adjacent === 2,
    adjacentThree: adjacent === 3,
    adjacentFour: adjacent === 4,
    adjacentFive: adjacent === 5,
    adjacentSix: adjacent === 6,
    adjacentSeven: adjacent === 7,
    adjacentEight: adjacent === 8,
    wrongFlag: isReveal && isFlag && !isMine,
  });

  const onClickGrid = (e: React.MouseEvent<HTMLElement>) => {
    if (e.detail === 1) {
      onClick(row, column);
    } else if (e.detail === 2) {
      onDoubleClick(row, column);
    }
  };

  const onRightClickGrid = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onRightClick(row, column);
  };

  const renderGridContent = () => {
    if (!isReveal) {
      return isFlag ? "🚩" : "";
    }

    if (isMine) {
      return "💣";
    }

    if (adjacent !== 0) {
      return `${adjacent}`;
    }

    return "";
  };

  return (
    <div className={className}>
      <button
        className={buttonContentClassName}
        onClick={onClickGrid}
        onContextMenu={onRightClickGrid}
      >
        {renderGridContent()}
      </button>
    </div>
  );
};

const StyledMineGameGrid = styled(MineGameGrid)`
  padding: 1px;
  .buttonContent {
    align-items: center;
    background-color: #424547;
    display: flex;
    height: 40px;
    justify-content: center;
    width: 40px;
  }
  .buttonReveal {
    background-color: #E5DCC8;
  }
  .buttonExplode {
    background-color: #E67A7A;
  }
  .adjacentOne {
    color: #393EF4;
  }
  .adjacentTwo {
    color: #187D3A;
  }
  .adjacentThree {
    color: #F48639;
  }
  .adjacentFour {
    color: #111DAD;
  }
  .adjacentFive {
    color: #AD1130;
  }
  .adjacentSix {
    color: #11ADA1;
  }
  .adjacentSeven {
    color: #A811AD;
  }
  .adjacentEight {
    color: #B69CB7;
  }
  .wrongFlag {
    color: #E67A7A;
  }
`;

export default StyledMineGameGrid;
