import styled from "styled-components";

export const FormButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    flex-direction: row;
  }
`;
