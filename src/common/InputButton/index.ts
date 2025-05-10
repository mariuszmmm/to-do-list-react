import styled from "styled-components";

export const InputButton = styled.button`
  color: ${({ theme }) => theme.color.empress};
  background: transparent;
  border: none;
  position: absolute;
  width: 2.5rem;
  height: 100%;
  right: 0;
  top: 2px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.color.silver};
  }
`;
