import styled from "styled-components";

export const BackupListContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  background-color: ${({ theme }) => theme.colors.backgroundSecendary};
    transition: border-color 0.5s ease-in-out;
`;
