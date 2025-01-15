import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Item = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-gap: 10px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.color.alto};

  ${({ edit, selected }) => (edit || selected) && css`
    background-color: ${({ theme }) => theme.color.silver};
  `}

  ${({ hidden }) => hidden && css`
    display: none;
  `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-template-columns: 1fr auto auto;
  }
`;

export const Content = styled.p`
  word-break: break-word;
  margin: 0;
  color: ${({ theme }) => theme.color.teal};
  margin: 0 5px;
  cursor: default;  

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-row: 1 / 2;
    grid-column: span 4;
    margin: 0;
  }

  span {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Task = styled.span`
  padding-left: 2px;
  
  ${({ done }) => done && css`
    text-decoration: 1px line-through black;
  `}
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.color.teal};
  text-decoration: none;

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }
`;

export const Button = styled.button`
  border: none;
  color: ${({ theme }) => theme.color.white};
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 20px;
  transition: filter 0.25s;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}) {
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ToggleButton = styled(Button)`
  background: ${({ theme }) => theme.color.forestGreen};
`;

export const EditButton = styled(Button)`
  background: ${({ theme }) => theme.color.empress};
`;

export const RemoveButton = styled(Button)`
  background: ${({ theme }) => theme.color.crimson};
`;