import styled from "styled-components";

export const Container = styled.main`
  max-width: 900px;
  padding: 20px 20px 20px;
  margin: 0 auto;
  min-height: calc(var(--app-height, 100dvh) - 50px);

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding: 20px 2% 2%;
  }
`;
