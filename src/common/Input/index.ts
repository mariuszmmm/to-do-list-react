import styled from "styled-components";

export const Input = styled.input`
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  width: 100%;
  border-radius: 5px;
  height: 42px;
  padding-right: ${({ name }) => (name === "search" ? "10px" : "2.5rem")};
  transition: border-color 0.5s ease-in-out;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecendary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.shadow.primary};
    cursor: not-allowed;
  }
`;
