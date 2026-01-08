import styled from "styled-components";

const TaskButton = styled.button`
  border-radius: 3px;
  border: none;
  color: ${({ theme }) => theme.colors.button.primaryText};
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
    cursor: auto;
    opacity: 0.4;
  }
`;

export const ToggleButton = styled(TaskButton)`
  background: ${({ theme }) => theme.colors.button.check};
`;

export const EditButton = styled(TaskButton)`
  background: ${({ theme }) => theme.colors.button.edit};
`;

export const RemoveButton = styled(TaskButton)`
  background: ${({ theme }) => theme.colors.button.remove};
`;

export const SortButton = styled(TaskButton)`
  background: ${({ theme }) => theme.colors.button.sort};
`;
