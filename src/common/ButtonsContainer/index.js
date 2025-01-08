import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
      column-gap: 30px;
  };
`;