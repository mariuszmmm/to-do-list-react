import styled from "styled-components";

interface SectionHeaderProps {
  $bodyHidden?: boolean;
  $onlyOpenButton?: boolean;
}

export const StyledSection = styled.section`
  margin: 10px 0;
  background: ${({ theme }) => theme.colors.backgroundSecendary};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 5px;
  transition: background-color 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
`;

export const SectionHeader = styled.header<SectionHeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  padding: 20px;
  margin: 0;
  word-break: break-word;
  white-space: pre-line;
  transition: border-color 0.5s ease-in-out;

  border-bottom: ${({ $bodyHidden, theme }) =>
    $bodyHidden ? "none" : `1px solid ${theme.colors.border.primary}`};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    flex-direction: ${({ $onlyOpenButton }) =>
      $onlyOpenButton ? "row" : "column"};
    padding-bottom: 10px;
  }
`;

export const SectionBody = styled.div`
  padding: 20px;
`;
