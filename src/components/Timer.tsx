import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  GAME_STATUS,
} from "../constants/mine";

interface Props {
  className?: string;
  gameStatus: GAME_STATUS;
}

const Timer = ({ className, gameStatus }: Props) => {
  const [timer, setTimer] = useState(0);
  const isFirstClick = gameStatus === GAME_STATUS.PENDING;
  const isGameOver = [GAME_STATUS.DEAD, GAME_STATUS.SUCCESS].includes(gameStatus);

  useEffect(() => {
    let interval: number | undefined;
    // Start timer when user start clicking on a grid
    if (!isFirstClick) {
      interval = setInterval(() => {
        if (!isGameOver && !isFirstClick) {
          setTimer(prev => prev + 1);
        }
      }, 1000);
    } else {
      setTimer(0);
    }

    // Stop timer when game is over
    if (isGameOver) {
      clearInterval(interval);
      setTimer(0);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isGameOver, isFirstClick]);

  return (
    <div className={className}>
      {`${timer}`.padStart(3, "0")}
    </div>
  );
};

const StyledTimer = styled(Timer)`
  background-color: #951616;
  color: #F92A2A;
  font-weight: 600;
  padding: 2px 4px;
`;

export default StyledTimer;
