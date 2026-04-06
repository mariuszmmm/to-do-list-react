import styled from "styled-components";

export const StyledCheckbox = styled.input<{ $isChecked: boolean }>`
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.colors.button.background};
  background-color: ${({ $isChecked, theme }) =>
    $isChecked ? theme.colors.button.background : "transparent"};
  transition: all 0.25s ease-in-out;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  flex-shrink: 0;

  &::after {
    content: "";
    display: ${({ $isChecked }) => ($isChecked ? "block" : "none")};
    width: 10px;
    height: 14px;
    border: solid ${({ theme }) => theme.colors.button.primaryText};
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    margin-top: -5px;
  }
`;
