import styled, { css } from "styled-components";

interface ButtonProps {
  $singleInput?: boolean;
  $noInputs?: boolean;
  width?: string;
}

export const FormButton = styled.button<ButtonProps>`
  padding: 10px;
  background: ${({ theme }) => theme.color.teal};
  color: ${({ theme }) => theme.color.white};
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
    background: ${({ theme }) => theme.color.silver};
    filter: none;
  }
`;
