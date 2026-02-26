import styled from "styled-components";

export const Container = styled.main`
  max-width: 900px;
  padding: 70px 20px 20px;
  margin: 0 auto;
  min-height: var(--app-height, 100dvh);

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding: 70px 2% 2%;
  }
`;
