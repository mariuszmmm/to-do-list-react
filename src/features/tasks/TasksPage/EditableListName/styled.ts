import styled from "styled-components";

interface NameContainerProps {
  $account?: boolean;
}

export const NameContainer = styled.form<NameContainerProps>`
  display: flex;
  align-items: start;
  gap: 4px;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  min-width: 49%;
  min-height: ${({ $account }) => ($account ? "auto" : "70px")};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    max-width: 100%;
    min-height: auto;
    margin-bottom: 10px;
  }
`;
