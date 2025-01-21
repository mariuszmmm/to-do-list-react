import styled, { css } from "styled-components";

interface ItemProps {
  $edit?: boolean;
  hidden?: boolean;
}

interface TaskProps {
  $done?: boolean;
}

export const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Item = styled.li<ItemProps>`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.color.alto};

  ${({ $edit }) =>
    $edit &&
    css`
      background-color: ${({ theme }) => theme.color.silver};
    `}

  ${({ hidden }) =>
    hidden &&
    css`
      display: none;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-template-columns: 1fr;
  }
`;

export const Content = styled.p`
  word-break: break-word;
  margin: 0;
  color: ${({ theme }) => theme.color.teal};
  margin: 0 5px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-row: 1 / 2;
    margin: 0;
  }

  span {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Task = styled.span<TaskProps>`
  padding-left: 2px;

  ${({ $done }) =>
    $done &&
    css`
      text-decoration: 1px line-through black;
    `}
`;
