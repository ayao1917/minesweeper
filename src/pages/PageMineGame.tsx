import React from "react";
import styled from "styled-components";

import MineGameBoard from "../components/MineGameBoard";

interface Props {
  className?: string;
}

const PageMineGame = ({ className }: Props) => {
  return (
    <div className={className}>
      <MineGameBoard />
    </div>
  )
}

const StyledMineGame = styled(PageMineGame)`
  dalign-items: center;
  display: flex;
  justify-content: center;
  width: 100vw;
`;

export default StyledMineGame;
