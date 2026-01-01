import styled from "styled-components";

export const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.color.alto};
  width: 100%;
  border-radius: 5px;
  height: 42px;
  padding-right: ${({ name }) => (name === "search" ? "10px" : "2.5rem")};

  &:disabled {
    color: ${({ theme }) => theme && theme.color.alto};
  }
`;
