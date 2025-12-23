import styled from "styled-components";

interface BackupItemProps {
  $isLoading?: boolean;
}

export const BackupItemsContainer = styled.div`
  min-height: 370px;
  margin-bottom: 15px;
`;

export const BackupListTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.teal};
  margin-bottom: 15px;
  text-align: center;
`;

export const BackupItem = styled.div<BackupItemProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.alto};
  border-radius: 4px;
  opacity: ${({ $isLoading }) => ($isLoading ? 0.6 : 1)};
  cursor: ${({ $isLoading }) => ($isLoading ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.color.gallery};
    border-color: ${({ theme }) => theme.color.teal};
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
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
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
  color: ${({ theme }) => theme.color.empress};
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
