import styled, { css } from "styled-components";

export const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 10px 0 25px;
`;

export const AccountCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: ${({ theme }) => theme.colors.backgroundSecendary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 12px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.secendary};
    background: ${({ theme }) => theme.colors.backgroundPrimary};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    padding: 18px;
  }
`;

export const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
`;

export const avatarColors = [
  "#007380", // Teal
  "#228c22", // Forest Green
  "#0083e7", // Blue
  "#db143c", // Crimson
  "#f6a800", // Orange
  "#6a1b9a", // Purple
  "#2e7d32", // Dark Green
  "#1565c0", // Dark Blue
  "#c62828", // Red
  "#4527a0", // Deep Purple
];

export const getAvatarColor = (email: string) => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

interface AccountAvatarProps {
  $bgColor?: string;
}

export const AccountAvatar = styled.div<AccountAvatarProps>`
  width: 42px;
  height: 42px;
  background: ${({ $bgColor, theme }) =>
    $bgColor || theme.colors.button.background};
  color: ${({ theme }) => theme.colors.button.primaryText};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  flex-shrink: 0;
  font-size: 1.1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
`;

export const AccountText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const AccountEmail = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.05rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AccountName = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecendary};
  margin-top: 2px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    justify-content: flex-end;
  }
`;

interface SwitcherButtonProps {
  $danger?: boolean;
}

export const SwitcherButton = styled.button<SwitcherButtonProps>`
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  ${({ $danger, theme }) =>
    $danger
      ? css`
          background: transparent;
          color: ${theme.colors.status.error};
          &:hover {
            background: ${theme.colors.status.error}15;
            border-color: ${theme.colors.status.error}30;
          }
        `
      : css`
          background: ${theme.colors.button.background};
          color: ${theme.colors.button.primaryText};
          &:hover {
            filter: brightness(1.1);
            box-shadow: 0 2px 8px ${theme.colors.button.background}40;
          }
        `}

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex: 1;
    padding: 10px;
  }
`;
