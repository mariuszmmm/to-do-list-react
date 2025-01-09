import styled, { css } from "styled-components";

export default styled.button`
  border: none;
  color: ${({ theme }) => theme.color.teal};
  font-size: 16px;
  background: transparent;
  margin-left: 20px;
  padding: 0;
  transition: filter 0.3s;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0 5px 20px;
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
  } 
`;