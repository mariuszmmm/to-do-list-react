import styled, { css } from "styled-components";

interface TaskActionsProps {
  $isLong?: boolean;
}

export const TaskActions = styled.div<TaskActionsProps>`
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: center;
  align-items: center;
  gap: 10px;
  max-width: 70px;
  cursor: default;
  pointer-events: auto;
  align-self: center;

  /* Sticky aktywuje się tylko dla długich zadań */
  ${({ $isLong }) =>
    $isLong &&
    css`
      position: sticky;
      top: 65px;
      bottom: 15px;
      margin: auto 0;
    `}

  &:has([disabled]) {
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    max-width: 100%;
    position: static;
    margin: 0;
    justify-content: flex-start;
    align-self: start;
  }
`;
