import styled, { css } from "styled-components";

interface StyledListItemProps {
  $edit?: boolean;
  selected?: boolean;
  hidden?: boolean;
  $sort?: boolean;
  $type?: "lists" | "tasks" | "tasksView" | "sort" | "archived";
  $isDragging?: boolean;
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
  disabled?: boolean;
  $isDragging?: boolean;
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  transition: background-color 0.3s ease-in-out, border-color 0.5s ease-in-out;

  grid-template-columns: ${({ $type }) =>
    $type === "tasks"
      ? "auto 1fr auto auto"
      : $type === "lists" || $type === "sort" || $type === "archived"
      ? "auto 1fr auto"
      : $type === "tasksView"
      ? "auto 1fr"
      : "auto"};

  ${({ selected, $type }) =>
    selected &&
    $type !== "archived" &&
    css`
      background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    `}

  ${({ $edit }) =>
    $edit &&
    css`
      background-color: ${({ theme }) => theme.colors.backgrouncSelected};
    `}
    
  ${({ hidden }) =>
    hidden &&
    css`
      display: none;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-template-columns: ${({ $type }) =>
      $type === "tasks" ||
      $type === "lists" ||
      $type === "sort" ||
      $type === "archived"
        ? "1fr auto"
        : $type === "tasksView"
        ? "1fr"
        : "auto"};
  }

  ${({ $type, $isDragging }) =>
    ($type === "sort" || $type === "archived") &&
    css`
      ${$isDragging &&
      css`
        background-color: ${({ theme }) => theme.colors.backgrouncSelected};
        z-index: 999;
        opacity: 1;
        cursor: grabbing;
        & * {
          cursor: grabbing;
        }
      `}

      ${!$isDragging &&
      css`
        &:hover {
          background-color: ${({ theme }) => theme.colors.backgroundPrimary};
          cursor: grab;

          & * {
            cursor: grab;
          }
        }
      `}
    `}
`;

export const StyledListContent = styled.div<StyledListContentProps>`
  word-break: break-word;
  margin: 0;
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

export const TaskNumber = styled.span<{
  $edit?: boolean;
  $isDragging?: boolean;
}>`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};

  ${({ $edit, $isDragging }) =>
    ($edit || $isDragging) &&
    css`
      color: ${({ theme }) =>
        $edit || $isDragging
          ? theme.colors.button.edit
          : theme.colors.textPrimary};
      pointer-events: none;
    `}
`;

export const StyledSpan = styled.span<StyledTaskProps>`
  padding-left: 2px;
  white-space: pre-line;
  font-style: red;

  ${({ $done }) =>
    $done &&
    css`
      text-decoration: 1px line-through
        ${({ theme }) => theme.colors.textPrimary};
    `};

  ${({ $ListName, $isDragging }) =>
    $ListName &&
    css`
      font-weight: ${({ theme }) => theme.fontWeight.bold};
      color: ${({ theme }) =>
        $isDragging ? theme.colors.textSecendary : theme.colors.textPrimary};
    `}

  ${({ $noLink, $isDragging }) =>
    $noLink &&
    css`
      color: ${({ theme }) =>
        $isDragging ? theme.colors.textSecendary : theme.colors.textPrimary};
    `}

  ${({ $comment }) =>
    $comment &&
    css`
      color: ${({ theme }) => theme.colors.textSecendary};
      font-style: italic;
      font-size: 0.85rem;
      font-weight: ${({ theme }) => theme.fontWeight.normal};
    `}

      ${({ disabled }) =>
    disabled &&
    css`
      text-decoration: 1px line-through
        ${({ theme }) => theme.colors.textSecendary};
    `};

  strong {
    ${({ $tokenStatus, theme }) =>
      $tokenStatus &&
      css`
        color: ${$tokenStatus === "active"
          ? theme.colors.status.success
          : theme.colors.status.warning};
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
