import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

interface StyledLinkProps {
  disabled?: boolean;
  $edit?: boolean;
}

export const StyledLink = styled(Link)<StyledLinkProps>`
  color: ${({ theme }) => theme.colors.button.secendaryText};
  text-decoration: none;
  white-space: pre-wrap;
  line-height: 1.4;
  cursor: pointer;

  ${({ disabled, $edit }) =>
    disabled &&
    css`
      color: ${({ theme }) =>
        $edit ? theme.colors.button.edit : theme.colors.button.disabled};
      pointer-events: none;
      cursor: not-allowed;
    `}

  &:hover {
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }
`;
