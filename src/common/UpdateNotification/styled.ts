import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`;

export const NotificationWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundSecendary};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.nav.background};
  transform: translateX(-50%) translateY(0);

  animation: ${slideUp} 0.4s ease-out;

  @media (max-width: 600px) {
    width: 90%;
    bottom: 15px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
`;

export const Message = styled.span`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 600px) {
    white-space: normal;
  }
`;

export const UpdateButton = styled.button`
  background-color: ${({ theme }) => theme.colors.button.background};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition:
    filter 0.2s,
    transform 0.1s;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
