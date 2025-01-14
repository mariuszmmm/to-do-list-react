import styled from "styled-components";

export const SubTitle = styled.span`
  min-width: 150px;
  width: content;
  text-transform: capitalize;
  padding-right: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    min-width: fit-content;
  }
`;