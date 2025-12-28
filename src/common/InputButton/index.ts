import styled from "styled-components";

export const InputButton = styled.button<{ $editedTask?: boolean }>`
  color: ${({ theme }) => theme.color.empress};
  background: transparent;
  border: none;
  position: absolute;
  width: 2.5rem;
  height: ${({ $editedTask }) => ($editedTask ? "2.5rem" : "100%")};
  right: 0;
  ${({ $editedTask }) => ($editedTask ? "bottom: 2px;" : "top: 2px; ")}
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.color.silver};
  }
`;
