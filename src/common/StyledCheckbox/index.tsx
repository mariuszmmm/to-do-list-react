import styled from "styled-components";

export const StyledCheckbox = styled.input<{ $isChecked: boolean }>`
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.button.background};
  transition: filter 0.25s;  
  
  &:hover {
    ${({ $isChecked, theme }) =>
    !$isChecked
      ? `outline: 1px solid ${theme.colors.button.background}; outline-offset: 1px;`
      : ""}
  }
`;
