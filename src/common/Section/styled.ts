import styled from "styled-components";

interface SectionHeaderProps {
  $bodyHidden?: boolean;
}

export const StyledSection = styled.section`
  margin: 10px 0;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0 0 5px ${({ theme }) => theme.color.alto};
  border-radius: 5px;
`;

export const SectionHeader = styled.header<SectionHeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 700;
  padding: 20px;
  margin: 0;
  word-break: break-word;
  border-bottom: ${({ $bodyHidden, theme }) =>
    $bodyHidden ? "none" : `1px solid ${theme.color.alto}`};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    flex-direction: column;
    padding-bottom: 10px;
  }
`;

export const SectionBody = styled.div`
  padding: 20px;
`;
