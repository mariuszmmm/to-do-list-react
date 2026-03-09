import styled from "styled-components";

const TaskButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  border: none;
  color: ${({ theme }) => theme.colors.button.primaryText};
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 20px;
  transition: filter 0.25s;
  user-select: none;
  cursor: pointer;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}) {
    grid-row: 2 / 3;
    grid-column: span 2;
  }

  &:hover {
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.3;
  }
`;

export const ToggleButton = styled(TaskButton)`
  background: ${({ theme }) => theme.colors.button.check};
`;

export const ImageButton = styled(TaskButton)<{ $hasImage?: boolean }>`
  background: ${({ theme }) => theme.colors.button.image};
  position: relative;

  &::after {
    content: "";
    display: ${({ $hasImage }) => ($hasImage ? "block" : "none")};
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.info.value};
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.button.primaryText};
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
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
