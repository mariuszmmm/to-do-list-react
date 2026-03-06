import styled from "styled-components";

export const TaskActions = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: center;
  align-items: center;
  gap: 10px;
  max-width: 70px;
  cursor: default;
  pointer-events: auto;

  /* Inteligentne pozycjonowanie: pływa w centrum widoku */
  position: sticky;
  top: 65px;
  bottom: 15px;
  margin: auto 0;
  align-self: center;

  &:has([disabled]) {
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    max-width: 100%;
    position: static;
    margin: 0;
    justify-content: flex-start;
    align-self: start;
  }
`;
