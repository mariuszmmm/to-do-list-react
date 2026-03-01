import styled from "styled-components";

export const CheckboxFieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  padding: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background-color: ${({ theme }) => theme.colors.backgroundSecendary};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 0.5s ease-in-out,
    border-color 0.5s ease-in-out;
`;
