import styled from "styled-components";

export const ListName = styled.span`
  min-width: 200px;
  width: content;
  padding-right: 5px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    min-width: fit-content;
  }
`;
