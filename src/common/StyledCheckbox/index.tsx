import styled, { DefaultTheme } from "styled-components";

export const StyledCheckbox = styled.input<{ $isChecked: boolean }>`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }: { theme: DefaultTheme }) => theme.color.teal};
  transition: filter 0.25s;  
  
  &:hover {
    ${({ $isChecked, theme }) =>
    !$isChecked
      ? `outline: 1px solid ${theme.color.teal}; outline-offset: 1px;`
      : ""}
  }
`;
