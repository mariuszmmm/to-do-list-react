import styled from "styled-components";
import { ModalButtonContainer, ModalConfirmButton } from "../../../../Modal/styled";

export const NotificationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;

  p {
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
    line-height: 1.5;
  }
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

  &:hover > div {
    border-color: ${({ theme }) => theme.colors.border.secendary};
    background: ${({ theme }) => theme.colors.backgroundPrimary};
  }
`;

export const FakeInput = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundSecendary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HiddenDateInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  opacity: 0;
  border: none;
  cursor: pointer;
  box-sizing: border-box;

  /* Rozpoznawanie jasnego vs ciemnego motywu do wyboru popovera browsera */
  color-scheme: ${({ theme }) =>
    theme.colors.textPrimary === "#151515ff" ? "light" : "dark"};

  &::-webkit-calendar-picker-indicator {
    display: none;
  }
`;


export const SaveButton = styled(ModalConfirmButton)`
  background-color: ${({ theme }) => theme.colors.button.check};
`;

export const ButtonContainer = styled(ModalButtonContainer)`
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;
