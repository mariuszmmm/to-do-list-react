import styled, { css } from "styled-components";

interface StyledListItemProps {
  $edit?: boolean;
  selected?: boolean;
  hidden?: boolean;
  $sort?: boolean;
  $type?: "lists" | "tasks" | "tasksView" | "sort";
}

interface StyledListContentProps {
  $type?: "lists" | "tasks" | "tasksView" | "sort";
}

interface StyledTaskProps {
  $done?: boolean;
  $ListName?: boolean;
  $comment?: boolean;
  $noLink?: boolean;
  $tokenStatus?: "active" | "expired";
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
      : $type === "lists" || $type === "sort"
      ? "auto 1fr auto"
      : $type === "tasksView"
      ? "auto 1fr"
      : "auto"};

  ${({ selected }) =>
    selected &&
    css`
      background-color: ${({ theme }) => theme.color.gallery};
    `}

  ${({ $edit }) =>
    $edit &&
    css`
      background-color: ${({ theme }) => theme.color.snowyMint};
    `}
    
  ${({ hidden }) =>
    hidden &&
    css`
      display: none;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-template-columns: ${({ $type }) =>
      $type === "tasks" || $type === "lists" || $type === "sort"
        ? "1fr auto"
        : $type === "tasksView"
        ? "1fr"
        : "auto"};
  }
`;

export const StyledListContent = styled.div<StyledListContentProps>`
  word-break: break-word;
  margin: 0;
  color: ${({ theme }) => theme.color.teal};
  margin: 0 5px;
  cursor: default;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-row: 1 / 2;
    margin: 0;
    ${({ $type }) =>
      $type === "lists" || $type === "sort"
        ? "grid-column: span 2;"
        : $type === "tasks"
        ? "grid-column: span 3;"
        : ""}
  }
`;

export const TaskNumber = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.color.black};
`;

export const StyledSpan = styled.span<StyledTaskProps>`
  padding-left: 2px;
  white-space: pre-line;
  font-style: red;

  ${({ $done }) =>
    $done &&
    css`
      text-decoration: 1px line-through black;
    `};

  ${({ $ListName }) =>
    $ListName &&
    css`
      font-weight: bold;
      color: ${({ theme }) => theme.color.black};
    `}

  ${({ $noLink }) =>
    $noLink &&
    css`
      color: ${({ theme }) => theme.color.black};
    `}

  ${({ $comment }) =>
    $comment &&
    css`
      color: ${({ theme }) => theme.color.empress};
      font-style: italic;
      font-size: 0.85rem;
      font-weight: normal;
    `}

  strong {
    ${({ $tokenStatus, theme }) =>
      $tokenStatus &&
      css`
        color: ${$tokenStatus === "active"
          ? theme.color.forestGreen
          : theme.color.red};
      `}
  }
`;

export const ListMeta = styled.div`
  display: flex;
  padding-top: 4px;
`;

export const ListMetaText = styled.div`
  display: inline-flex;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 4px;
  row-gap: 2px;
`;
