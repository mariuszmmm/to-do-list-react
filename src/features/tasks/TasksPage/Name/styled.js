import styled from "styled-components";

export const NameContainer = styled.form`
  display: flex;
  align-items: start;
  gap: 2px;
  flex-wrap: wrap;
  flex-direction: column;
  max-width: fit-content;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    max-width: 100%;
  }
`;
