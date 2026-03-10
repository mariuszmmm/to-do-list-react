import styled from "styled-components";

export const ModalBackground = styled.div<{ $clickable?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  min-height: fit-content;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  z-index: 2000;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

export const ModalContainer = styled.div`
  max-width: 900px;
  min-width: 360px;
  padding: 160px 20px 0;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    padding: 156px 2% 2%;
  }

  @media (max-height: 400px) {
    padding: 80px 2% 2%;
  }
`;

export const ModalBody = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecendary};
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  cursor: default;
`;

export const ModalHeader = styled.header`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

export const HeaderContent = styled.h1`
  font-size: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  padding: 20px;
  margin: 0;
`;

export const ModalDescription = styled.p`
  padding: 24px 20px;
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const ModalButton = styled.button`
  padding: 10px;
  min-width: 100px;
  color: ${({ theme }) => theme.colors.button.primaryText};
  border: none;
  border-radius: 5px;
  transition: filter 0.25s;
  user-select: none;

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.button.disabled};
    color: ${({ theme }) => theme.colors.button.cancel};
    filter: none;
    cursor: auto;
  }
`;

export const ModalConfirmButton = styled(ModalButton)`
  background-color: ${({ theme }) => theme.colors.button.remove};
`;

export const ModalCancelButton = styled(ModalButton)`
  background-color: ${({ theme }) => theme.colors.button.cancel};
`;

export const ModalCloseButton = styled(ModalButton)`
  background-color: ${({ theme }) => theme.colors.button.background};
`;

export const ModalYesButton = styled(ModalButton)`
  background-color: ${({ theme }) => theme.colors.button.check};
`;

export const ModalNoButton = ModalConfirmButton;
