import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

interface StyledLinkProps {
  disabled?: boolean;
}

export const StyledLink = styled(Link)<StyledLinkProps>`
  color: ${({ theme }) => theme.color.teal};
  text-decoration: none;

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${({ theme }) => theme.color.empress};
      pointer-events: none;
    `}

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }
`;
