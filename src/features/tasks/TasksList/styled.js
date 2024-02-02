import styled, { css } from "styled-components";

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Item = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 10px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.color.alto};

  ${({ hidden }) => hidden && css`
    display: none;
  `}
`;

export const Content = styled.p`
  word-break: break-word;
  margin: 0;
  color: ${({ theme }) => theme.color.teal};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}px) {
    grid-row: 1 / 2;
    grid-column: span 4;
  }
`;

export const Text = styled.span`
  ${({ done }) => done && css`
    text-decoration: 2px line-through;
  `}
`;

export const Button = styled.button`
  border: none;
  color: ${({ theme }) => theme.color.white};
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 20px;
  transition: filter 0.25s;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}px) {
    grid-row: 2 / 3;
    grid-column: span 2;
  }
   
  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }
`;

export const ToggleButton = styled(Button)`
  background: ${({ theme }) => theme.color.forestGreen};
`;

export const RemoveButton = styled(Button)`
  background: ${({ theme }) => theme.color.crimson};
`;