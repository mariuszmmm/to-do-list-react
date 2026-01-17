import styled from "styled-components";

export const StyledSection = styled.section`
  margin: 10px 0;
  background: ${({ theme }) => theme.colors.backgroundSecendary};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 5px;
  transition:
    background-color 0.5s ease-in-out,
    box-shadow 0.5s ease-in-out;
`;

interface SectionHeaderProps {
  hidden?: boolean;
  $onlyOpenButton?: boolean;
  $taskDetails?: boolean;
}

export const SectionHeader = styled.header<SectionHeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  padding: 20px;
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: ${({ $taskDetails }) => ($taskDetails ? "1.6" : "1")};
  transition:
    color 0.5s ease-in-out,
    border-color 0.5s ease-in-out;

  border-bottom: ${({ hidden, theme }) =>
    hidden
      ? `1px solid transparent`
      : `1px solid ${theme.colors.border.primary}`};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    flex-direction: ${({ $onlyOpenButton }) =>
      $onlyOpenButton ? "row" : "column"};
  }
`;

interface SectionBodyProps {
  $taskList?: boolean;
  hidden?: boolean;
}

export const SectionBody = styled.div<SectionBodyProps>`
  display: grid;
  grid-template-rows: ${({ hidden }) => (hidden ? "0fr" : "1fr")};
  overflow: hidden;
  opacity: ${({ hidden }) => (hidden ? "0" : "1")};
  transition:
    grid-template-rows 0.3s ease-in-out,
    opacity 0.5s ease-in-out;

  & > * {
    min-height: 0;
  }
`;

interface BodyWrapperProps {
  $taskList?: boolean;
}

export const BodyWrapper = styled.div<BodyWrapperProps>`
  padding: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    padding: ${({ $taskList }) => ($taskList ? "20px 10px" : "20px")};
  }
`;
