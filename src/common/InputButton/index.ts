import styled from "styled-components";

export const InputButton = styled.button`
  color: ${({ theme }) => theme.color.empress};
  background: transparent;
  border: none;
  position: absolute;
  width: 2.5rem;
  height: 100%;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.color.silver};
  }
`;
