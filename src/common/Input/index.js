import styled, { css } from "styled-components";

export const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.color.alto};
  width: 100%;
  border-radius: 5px;

  ${({ hidden }) => hidden && css`
    display: none;
  `}  
`;