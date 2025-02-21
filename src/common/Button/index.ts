import styled, { css } from "styled-components";

interface ButtonProps {
  $special?: boolean;
  $selected?: boolean;
  $error?: boolean;
  $noDisplay?: boolean;
  width?: string;
}

export const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: ${({ width }) => width || "40px"};
  min-width: max-content;
  font-size: 16px;
  line-height: 16px;
  margin: 3px 0 0 20px;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.color.teal};
  border: none;
  transition: filter 0.3s;
  user-select: none;

  ${({ $special }) =>
    $special &&
    css`
      margin: 0;
    `};

  ${({ $selected }) =>
    $selected &&
    css`
      text-decoration: underline;
      text-underline-offset: 5px;
    `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    margin: 2px 10px 0;
    align-items: center;

    ${({ $special }) =>
      $special &&
      css`
        margin: 0;
      `};
  }

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(130%);
  }

  &:disabled {
    color: ${({ theme }) => theme.color.silver};
    filter: brightness(100%);
    cursor: auto;

    ${({ $error }) =>
      $error &&
      css`
        color: ${({ theme }) => theme.color.red};
      `};
  }
`;
