import styled, { css } from "styled-components";

interface ButtonProps {
  $singleInput?: boolean;
  $noInputs?: boolean;
  width?: string;
  $cancel?: boolean;
}

export const FormButton = styled.button<ButtonProps>`
  padding: 10px;
  background: ${({ $cancel, theme }) =>
    $cancel ? theme.colors.button.cancel : theme.colors.button.background};
  color: ${({ theme }) => theme.colors.button.primaryText};
  border: none;
  min-width: 110px;
  border-radius: 5px;
  transition: filter 0.25s;
  user-select: none;
  width: ${({ width }) => width || "auto"};
  height: 42px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-column: 1 / -1;

    ${({ $singleInput }) =>
      $singleInput &&
      css`
        grid-column: auto;
      `}
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-column: 1 / -1;
    width: 100%;
  }

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.button.disabled};
    color: ${({ theme }) => theme.colors.textSecendary};
    filter: none;
    cursor: not-allowed;
  }
`;
