import React from "react";
import styled from "styled-components";

interface Props {
  className?: string;
}

const Header = ({ className }: Props) => {
  return (
    <div className={className}>
      {/* Add some content here */}
    </div>
  );
};

const StyledHeader = styled(Header)`
  display: flex;
  flex-direction: flex-end;
  padding: 8px;
  width: 100%;
`;

export default StyledHeader;
