import styled from "styled-components";

interface InputProps {
  hidden?: boolean;
}

export const Input = styled.input<InputProps>`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.color.alto};
  width: 100%;
  border-radius: 5px;
  height: 42px;

  &:disabled {
    color: ${({ theme }) => theme && theme.color.alto};
  }
`;
