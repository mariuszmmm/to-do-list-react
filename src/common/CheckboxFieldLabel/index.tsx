import styled from "styled-components";

export const CheckboxFieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid ${({ theme }) => theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.alto};
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
`;
