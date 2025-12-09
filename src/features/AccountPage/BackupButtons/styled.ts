import styled from "styled-components";

export const MessageContainer = styled.div`
  min-height: ${({ children }) => (children ? "50px" : "0")};
  margin-bottom: ${({ children }) => (children ? "10px" : "0")};
  display: flex;
  align-items: center;
  transition: min-height 0.2s ease, margin-bottom 0.2s ease;
`;

export const BackupListContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.alto};
  border-radius: 4px;
`;

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

export const BackupItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.alto};
  border-radius: 4px;
  cursor: pointer;
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
  margin-left: 26px;
`;

export const BackupActionsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

export const PaginationContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

export const PaginationButton = styled.button<{ $disabled?: boolean }>`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.teal};
  border: 2px solid ${({ theme }) => theme.color.teal};
  border-radius: 4px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  transition: all 0.2s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.color.teal};
    color: ${({ theme }) => theme.color.white};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  font-size: 1.1em;
  color: ${({ theme }) => theme.color.teal};
  font-weight: 700;
  min-width: 100px;
  text-align: center;
  letter-spacing: 0.5px;
`;
