import styled from "styled-components";

export const NameContainer = styled.form`
  display: flex;
  align-items: start;
  gap: 2px;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  min-width: 49%;
  min-height: 70px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    max-width: 100%;
    min-height: auto;
    margin-bottom: 10px;
  }
`;
