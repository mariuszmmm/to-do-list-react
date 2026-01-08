import styled, { css } from "styled-components";
import { ReactComponent as SunIcon } from "./../../images/sun-icon.svg";

export const Wrapper = styled.button`
  display: flex;
  align-items: center;
  align-self: flex-end;
  gap: 12px;
  min-width: max-content;
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;
  padding: 0;
  color: ${({ theme }) => theme.colors.themeSwitch.text};
`;

export const Switch = styled.div`
  display: flex;
  align-items: center;
  width: 48px;
  height: 26px;
  padding: 3px;
  border: 1px solid;
  border-radius: 13px;
`;

export const IconWrapper = styled.div<{ $moveToRight: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: currentColor;
  border-radius: 50%;
  transition: transform 0.3s ease-in-out;

  ${({ $moveToRight }) =>
    $moveToRight &&
    css`
      transform: translateX(20px) rotate(180deg);
    `}
`;

export const Icon = styled(SunIcon)`
  color: ${({ theme }) => theme.colors.themeSwitch.icon};
`;
