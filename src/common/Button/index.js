import styled, { css } from "styled-components";

export default styled.button`
  border: none;
  color: ${({ theme }) => theme.color.teal};
  font-size: 16px;
  background: transparent;
  padding: 2px 0 0 20px;
  transition: filter 0.3s;
  user-select: none;
  width: 40px;
  min-width: max-content;

  ${({ forName }) => forName && css`
    padding: 0 0 0 2px;
  `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    display: flex;
    flex-direction: column;
    align-items: center;

    ${({ forName }) => forName && css`
      padding: 0 0 0 2px;
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

    ${({ error }) => error && css`
      color: ${({ theme }) => theme.color.red};
    `};

    ${({ noDisplay }) => noDisplay && css`
      display: none;
    `};
  } 
`;