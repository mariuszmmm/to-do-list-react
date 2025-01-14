import styled, { css } from "styled-components";

export const StyledSection = styled.section`
  margin: 10px 0;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0 0 5px ${({ theme }) => theme.color.alto};;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.alto};
  word-break: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
    padding-bottom: 10px;
  }
`;

export const SectionBody = styled.div`
  padding: 20px;

  ${({ hidden }) => hidden && css`
    display: none;
  `}
`;