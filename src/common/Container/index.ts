import styled from "styled-components";

export const Container = styled.main`
  max-width: 900px;
  padding: 70px 20px 20px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding: 60px 2% 2%;
  }
`;
