import styled, { css } from "styled-components";

interface Props {
  $forName?: boolean;
  $error?: boolean;
  $noDisplay?: boolean;
}

export default styled.button<Props>`
  border: none;
  color: ${({ theme }) => theme.color.teal};
  font-size: 16px;
  background: transparent;
  margin: 2px 0 0 20px;
  padding: 0;
  transition: filter 0.3s;
  user-select: none;
  width: 40px;
  min-width: max-content;

  ${({ $forName }) =>
    $forName &&
    css`
      margin: 0;
    `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    display: flex;
    flex-direction: column;
    align-items: center;
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

    ${({ $noDisplay }) =>
      $noDisplay &&
      css`
        display: none;
      `};
  }
`;
