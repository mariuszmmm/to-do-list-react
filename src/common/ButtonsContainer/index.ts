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
      margin-top: 10px;
    `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    justify-content: center;
    margin-top: 10px;

    ${({ $sub }) =>
      $sub &&
      css`
        margin-top: 0;
      `};
  }
`;
