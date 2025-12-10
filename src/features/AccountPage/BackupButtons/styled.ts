import styled from "styled-components";
import { FormButton } from "../../../common/FormButton";

export const MessageContainer = styled.div`
  min-height: ${({ children }) => (children ? "50px" : "0")};
  margin-bottom: ${({ children }) => (children ? "10px" : "0")};
  display: flex;
  align-items: center;
  transition: min-height 0.2s ease, margin-bottom 0.2s ease;
`;
// Usunięto BackupListContainer, używaj UniversalContainer z common
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

export const PaginationContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

export const PaginationButton = styled(FormButton)<{ $cancel?: boolean }>`
  padding: 10px 16px;
  min-width: 110px;
  height: 42px;
  margin: 0;
`;

export const ArrowIcon = styled.span<{ $left?: boolean }>`
  display: inline-block;
  margin: 0 6px;
  transform: ${({ $left }) => ($left ? "rotate(180deg)" : "none")};
`;

export const PaginationInfo = styled.span`
  font-size: 1.1em;
  color: ${({ theme }) => theme.color.teal};
  font-weight: 700;
  min-width: 100px;
  text-align: center;
  letter-spacing: 0.5px;
`;
