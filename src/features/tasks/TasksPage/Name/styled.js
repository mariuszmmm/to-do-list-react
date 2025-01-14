import styled from "styled-components";

export const NameContainer = styled.form`
  display: flex;
  align-items: start;
  gap: 5px;
  flex-wrap: wrap;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: row;
    align-items: center;
  }
`;
