import styled from "styled-components";

const Container = styled.main`
  max-width: 900px;
  padding: 20px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}px) {
    padding: 2%;
  }
`;

export default Container;