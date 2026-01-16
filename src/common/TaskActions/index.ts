import styled from "styled-components";

export const TaskActions = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 10px;
  max-width: 70px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    max-width: 100%;
  }
`;
