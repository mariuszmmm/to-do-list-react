import styled from "styled-components";

export const UserManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 5px;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.nav.background};
  }
`;

export const SummaryTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SummaryValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-left: 5px;
`;

export const SummaryLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecendary};
`;

export const InviteSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.backgroundSecendary};
  border: 2px dashed ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
`;

export const InviteInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
  }

  & > input {
    flex-grow: 1;
  }

  & > button {
    flex-shrink: 0;
    white-space: nowrap;
    width: 180px;
    height: auto;

    @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
      width: 100%;
    }
  }
`;

export const FormLabel = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MessageWrapper = styled.div<{ $isVisible: boolean }>`
  max-height: ${({ $isVisible }) => ($isVisible ? "100px" : "0")};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  margin-top: ${({ $isVisible }) => ($isVisible ? "0" : "-15px")};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, margin-top 0.4s ease-in-out;
`;

export const Message = styled.div<{ $isError?: boolean }>`
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  min-height: 0;
  background: ${({ theme, $isError }) =>
    $isError ? `rgba(255, 62, 62, 0.1)` : `rgba(34, 140, 34, 0.1)`};
  color: ${({ theme, $isError }) =>
    $isError ? theme.colors.status.error : theme.colors.status.success};
  border: 1px solid
    ${({ theme, $isError }) =>
      $isError ? theme.colors.status.error : theme.colors.status.success};
`;

export const SubTitle = styled.h3`
  font-size: 18px;
  margin: 10px 0 15px;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 10px;

  &::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border.primary};
  }
`;

export const IconWrapper = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.nav.background}33;
  color: ${({ theme }) => theme.colors.status.info};

  & svg {
    width: 20px;
    height: 20px;
  }
`;
