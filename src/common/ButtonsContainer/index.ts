import styled, { css } from "styled-components";

interface ButtonsContainerProps {
  $sub?: boolean;
  $extra?: boolean;
}

export const ButtonsContainer = styled.div<ButtonsContainerProps>`
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  align-items: start;
  align-content: flex-start;
  row-gap: 15px;

  ${({ $sub }) =>
    $sub &&
    css`
      margin-top: 0;
      width: 100%;
    `};

  ${({ $extra }) =>
    $extra &&
    css`
      flex-direction: column;
      justify-content: left;
      margin-top: 15px;
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
          `}

    ${({ $sub }) =>
      $sub &&
      css`
        margin-top: 0;
      `};
  }
`;
