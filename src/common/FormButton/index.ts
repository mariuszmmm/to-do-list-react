import styled, { css } from "styled-components";

interface ButtonProps {
  $singleInput?: boolean;
  $noInputs?: boolean;
  width?: string;
  $cancel?: boolean;
  $remove?: boolean;
  $image?: boolean;
}

export const FormButton = styled.button<ButtonProps>`
  padding: 10px;
  background: ${({ $cancel, $remove, $image, theme }) =>
    $cancel
      ? theme.colors.button.cancel
      : $remove
        ? theme.colors.button.remove
        : $image
          ? theme.colors.button.image
          : theme.colors.button.background};
  color: ${({ theme, $image }) => ($image ? theme.colors.button.blackText : theme.colors.button.primaryText)};
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
