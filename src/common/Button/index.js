import styled, { css } from "styled-components";

export default styled.button`
  border: none;
  color: ${({ theme }) => theme.color.teal};
  font-size: 16px;
  background: transparent;
  margin: 0 0 0 20px;
  padding: 0;
  transition: filter 0.3s;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;
    padding-top: 10px;
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