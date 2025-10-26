import styled, { css } from "styled-components";

interface StyledListItemProps {
  $edit?: boolean;
  selected?: boolean;
  hidden?: boolean;
  $sort?: boolean;
  $type?: "lists" | "tasks" | "tasksView";
}

interface StyledListContentProps {
  $type?: "lists" | "tasks" | "tasksView";
}

interface StyledTaskProps {
  $done?: boolean;
  $ListName?: boolean;
}

export const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const StyledListItem = styled.li<StyledListItemProps>`
  display: grid;
  grid-gap: 10px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.color.alto};
  transition: background-color 0.25s;

  grid-template-columns: ${({ $type }) =>
    $type === "tasks"
      ? "auto 1fr auto auto"
      : $type === "lists"
      ? "auto 1fr auto"
      : $type === "tasksView"
      ? "auto 1fr"
      : "auto"};

  ${({ $edit, selected }) =>
    ($edit || selected) &&
    css`
      background-color: ${({ theme }) => theme.color.silver};
    `}

  ${({ hidden }) =>
    hidden &&
    css`
      display: none;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-template-columns: ${({ $type }) =>
      $type === "lists"
        ? "1fr auto auto"
        : $type === "tasks"
        ? "1fr auto"
        : $type === "tasksView"
        ? "1fr"
        : "auto"};
  }
`;

export const StyledListContent = styled.p<StyledListContentProps>`
  word-break: break-word;
  margin: 0;
  color: ${({ theme }) => theme.color.teal};
  margin: 0 5px;
  cursor: default;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-row: 1 / 2;
    margin: 0;
    ${({ $type }) =>
      $type === "lists"
        ? "grid-column: span 2;"
        : $type === "tasks"
        ? "grid-column: span 3;"
        : ""}
  }

  span {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const StyledTask = styled.span<StyledTaskProps>`
  padding-left: 2px;
  white-space: pre-line;

  ${({ $done }) =>
    $done &&
    css`
      text-decoration: 1px line-through black;
    `};

  ${({ $ListName }) =>
    $ListName &&
    css`
      font-weight: bold;
    `}
`;
