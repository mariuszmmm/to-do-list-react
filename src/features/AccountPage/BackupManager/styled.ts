import styled from "styled-components";

export const BackupListContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background-color: ${({ theme }) => theme.colors.backgroundSecendary};
  transition:
    background-color 0.5s ease-in-out,
    border-color 0.5s ease-in-out;
`;

interface BackupItemProps {
  $isLoading?: boolean;
}

export const BackupItemsContainer = styled.div`
  min-height: 370px;
  margin-bottom: 15px;
`;

export const BackupListTitle = styled.div`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 15px;
  text-align: center;
  transition: color 0.5s ease-in-out;
`;

export const BackupItem = styled.div<BackupItemProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundSecendary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 4px;
  opacity: ${({ $isLoading }) => ($isLoading ? 0.6 : 1)};
  cursor: ${({ $isLoading }) => ($isLoading ? "not-allowed" : "pointer")};

  transition:
    background-color 0.5s ease-in-out,
    border-color 0.5s ease-in-out,
    transform 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    border-color: ${({ theme }) => theme.colors.border.secendary};
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const BackupFileInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const BackupFileName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.button.secendaryText};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "📄";
    font-size: 18px;
  }
`;

export const BackupFileDate = styled.div`
  font-size: 0.85em;
  color: ${({ theme }) => theme.colors.textSecendary};
  margin-left: 28px;
`;

export const BackupActionsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
