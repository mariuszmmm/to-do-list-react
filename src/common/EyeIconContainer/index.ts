import styled, { css } from "styled-components";

interface EyeIconProps {
  hidden: boolean;
}

export const EyeIconContainer = styled.div<EyeIconProps>`
  ${({ hidden }) => css`
    display: ${hidden ? "none" : "flex"};
  `}
  position: absolute;
  width: 2.5rem;
  height: 100%;
  top: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`;
