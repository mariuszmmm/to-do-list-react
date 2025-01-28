import styled, { css } from "styled-components";

interface ButtonProps {
  $register: boolean;
}

export const StyledForm = styled.form`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 20px;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-template-columns: auto;
  }
`;

export const Button = styled.button<ButtonProps>`
  padding: 10px;
  background: ${({ theme }) => theme.color.teal};
  color: ${({ theme }) => theme.color.white};
  border: none;
  transition: filter 0.25s;
  user-select: none;
  grid-column: 1/3;

  ${({ $register }) =>
    $register &&
    css`
      grid-column: 1/4;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    background-color: ${({ theme }) => theme.color.teal};
    grid-column: auto;
  }

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }

  &:disabled {
    opacity: 0.5;
  }
`;
