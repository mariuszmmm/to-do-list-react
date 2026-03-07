import styled, { css } from "styled-components";

interface ButtonsContainerProps {
  $sub?: boolean;
  $extra?: boolean;
  $compactSwitcher?: boolean;
}

export const ButtonsContainer = styled.div<ButtonsContainerProps>`
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  align-items: start;
  align-content: center;
  gap: 15px;

  ${({ $sub }) =>
    $sub &&
    css`
      margin-top: 0;
      width: 100%;
    `};

  ${({ $compactSwitcher, theme }) =>
    $compactSwitcher &&
    css`
      flex-wrap: nowrap;
      align-items: center;
      flex-shrink: 0;
      padding-left: 10px;
      gap: 10px;

      @media (max-width: ${theme.breakpoint.mobileMid}) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        margin: 0;
      }
    `};

  ${({ $extra }) =>
    $extra &&
    css`
      flex-direction: column;
      justify-content: left;
      align-content: flex-start;
      margin-top: 10px;
    `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    width: min-content;
    min-width: 230px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    justify-content: center;
    width: auto;

    ${({ $extra }) =>
      $extra
        ? css`
            margin-top: 10px;
          `
        : css`
            margin: 10px 40px 0;
          `};

    ${({ $sub }) =>
      $sub &&
      css`
        margin-top: 0;
      `};
  }
`;
