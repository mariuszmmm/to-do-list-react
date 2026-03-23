import styled from "styled-components";
import {
  ModalButtonContainer,
  ModalConfirmButton,
  ModalCancelButton,
} from "../../../../Modal/styled";

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
  width: 140px; /* Stała, jednakowa szerokość dla obu przycisków */
`;

export const ModalCancelButtonUnified = styled(ModalCancelButton)`
  width: 140px; /* Stała, jednakowa szerokość dla obu przycisków */
`;

export const ButtonContainer = styled(ModalButtonContainer)`
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  justify-content: center;
  gap: 15px;
`;

export const ScheduledList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  padding: 15px;
  max-height: 320px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.backgroundPrimary};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}) {
    padding: 10px;
  }
`;

export const ScheduledHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
`;

export const ScheduledHeader = styled.h3`
  font-size: 0.75rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecendary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CounterBadge = styled.span`
  background: ${({ theme }) => theme.colors.button.check};
  color: white;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  min-width: 18px;
  height: 18px;
  flex-shrink: 0;
`;

export const ScheduledItem = styled.div<{
  $isHovered?: boolean;
  $isEditing?: boolean;
  $isDimmed?: boolean;
}>`
  background: ${({ theme, $isEditing }) =>
    $isEditing
      ? theme.colors.textPrimary === "#151515ff"
        ? "rgba(246, 168, 0, 0.08)"
        : "rgba(246, 168, 0, 0.05)"
      : theme.colors.backgroundSecendary};
  opacity: ${({ $isDimmed }) => ($isDimmed ? 0.4 : 1)};
  filter: ${({ $isDimmed }) => ($isDimmed ? "grayscale(40%)" : "none")};
  pointer-events: ${({ $isDimmed }) => ($isDimmed ? "none" : "auto")};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid
    ${({ theme, $isHovered, $isEditing }) =>
      $isEditing
        ? theme.colors.info.value2
        : $isHovered
          ? theme.colors.button.check
          : theme.colors.border.primary};
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${({ $isHovered, $isEditing }) =>
    $isEditing || $isHovered
      ? "0 4px 12px rgba(0, 0, 0, 0.15)"
      : "0 2px 5px rgba(0, 0, 0, 0.05)"};
  transition: all 0.2s ease-in-out;
  transform: ${({ $isEditing }) => ($isEditing ? "scale(1.01)" : "scale(1)")};
  position: relative;
`;

export const ScheduledHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

export const ScheduledInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

export const ScheduledDate = styled.div`
  color: ${({ theme }) => theme.colors.button.check};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  background: ${({ theme }) =>
    theme.colors.textPrimary === "#151515ff"
      ? "rgba(34, 140, 34, 0.06)"
      : "rgba(34, 140, 34, 0.15)"};
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
`;

export const ScheduledText = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  word-break: break-word;
  line-height: 1.4;
  margin-left: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}) {
    font-size: 0.85rem;
  }
`;

export const ScheduledListName = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ theme }) =>
    theme.colors.textPrimary === "#151515ff"
      ? "rgba(0, 0, 0, 0.03)"
      : "rgba(255, 255, 255, 0.04)"};
  padding: 2px 6px;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  display: inline-block;
  margin-top: -2px;
`;

export const ScheduledUserEmail = styled(ScheduledListName)`
  text-transform: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  opacity: 0.8;
`;
