import styled from "styled-components";

export const InputButton = styled.button<{ $editedTask?: boolean }>`
  color: ${({ theme }) => theme.colors.button.edit};
  background: ${({ theme }) => theme.colors.button.transparent};
  border: none;
  position: absolute;
  width: 2.6rem;
  height: ${({ $editedTask }) => ($editedTask ? "2.5rem" : "100%")};
  right: 0;
  ${({ $editedTask }) => ($editedTask ? "bottom: 2px;" : "top: 2px; ")}
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.button.disabled};
  }
`;
