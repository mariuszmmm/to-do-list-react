import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  margin: 0 0 50px;
  text-align: left;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    margin: 0 0 30px;
  }
`;
