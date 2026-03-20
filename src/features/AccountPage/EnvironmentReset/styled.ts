import styled from "styled-components";

export const ResetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 15px 0 10px 0;
`;

export const OperationsList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
  list-style: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
`;

export const OperationItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;

  &::before {
    content: "•";
    color: ${({ theme }) => theme.colors.status.info};
    font-weight: bold;
  }
`;

export const OperationsTitle = styled.h4`
  margin: 0 0 8px 0;
  padding-left: 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.status.info};
`;
