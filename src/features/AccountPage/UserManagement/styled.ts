import styled from "styled-components";

export const UserManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 5px;
`;

export const InviteSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.backgroundSecendary};
  border: 2px dashed ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding: 15px;
  }
`;

export const InviteInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    flex-direction: column;
  }

  & > input {
    flex-grow: 1;
    min-width: 0;
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
  transition:
    max-height 0.4s ease-in-out,
    opacity 0.4s ease-in-out,
    margin-top 0.4s ease-in-out;
`;

export const Message = styled.div<{ $isError?: boolean }>`
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  min-height: 0;
  background: ${({ $isError }) =>
    $isError ? `rgba(255, 62, 62, 0.1)` : `rgba(34, 140, 34, 0.1)`};
  color: ${({ theme, $isError }) =>
    $isError ? theme.colors.status.error : theme.colors.status.success};
  border: 1px solid
    ${({ theme, $isError }) =>
      $isError ? theme.colors.status.error : theme.colors.status.success};
  transition:
    background 0.4s ease-in-out,
    color 0.4s ease-in-out,
    border-color 0.4s ease-in-out;
`;

export const UsersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  padding-bottom: 5px;
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

export const UsersListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 10px;
  transition: border-color 0.2s;
  flex-wrap: wrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.nav.background};
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}) {
    padding: 10px;
    gap: 8px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    gap: 6px;
  }
`;

export const UserEmail = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 120px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    min-width: 0;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const UserStatusBadge = styled.span<{
  $status: "active" | "pending" | "deleted";
}>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $status }) =>
    $status === "active"
      ? `rgba(34, 197, 94, 0.15)`
      : $status === "pending"
        ? `rgba(250, 200, 40, 0.15)`
        : `rgba(239, 68, 68, 0.15)`};
  color: ${({ theme, $status }) =>
    $status === "active"
      ? theme.colors.status.success
      : $status === "deleted"
        ? theme.colors.status.error
        : "#e6c52a"};
  border: 1px solid
    ${({ theme, $status }) =>
      $status === "active"
        ? theme.colors.status.success
        : $status === "deleted"
          ? theme.colors.status.error
          : "#e6c52a"};
`;

export const DeleteButton = styled.button<{ $isConfirm?: boolean }>`
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, $isConfirm }) =>
      $isConfirm ? theme.colors.status.error : theme.colors.border.primary};
  background: ${({ $isConfirm }) =>
    $isConfirm ? `rgba(239, 68, 68, 0.12)` : "transparent"};
  color: ${({ theme, $isConfirm }) =>
    $isConfirm ? theme.colors.status.error : theme.colors.textSecendary};
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s;
  margin-left: auto;

  &:hover {
    border-color: ${({ theme }) => theme.colors.status.error};
    color: ${({ theme }) => theme.colors.status.error};
    background: rgba(239, 68, 68, 0.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    width: 100%;
    padding: 8px;
    margin-left: 0;
  }
`;
