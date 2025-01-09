import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: right;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    justify-content: center;
  };
`;