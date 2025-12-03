import styled, { css } from "styled-components";
import { ReactComponent as Rotate } from "../../images/rotate.svg";
import { ReactComponent as CircleCheck } from "../../images/circle-check.svg";
import { ReactComponent as CircleInfo } from "../../images/circle-info.svg";
import { ReactComponent as CircleWarning } from "../../images/circle-warning.svg";
import { ReactComponent as CircleLoading } from "../../images/circle-loading.svg";
import { ReactComponent as Circle } from "../../images/circle.svg";
import { ReactComponent as Eye } from "../../images/eye.svg";
import { ReactComponent as EyeSlash } from "../../images/eye-slash.svg";
import { ReactComponent as ArrowUp } from "../../images/arrow-up.svg";
import { ReactComponent as Microphone } from "../../images/microphone.svg";

interface MicrophoneIconProps {
  $isActive?: boolean;
}

interface CircleIconProps {
  $isPending?: boolean;
  $isError?: boolean;
  $isUpdated?: boolean;
  $isChanged?: boolean;
  $isActive?: boolean;
}

export const MicrophoneIcon = styled(Microphone)<MicrophoneIconProps>`
  width: 1rem;
  color: ${({ theme, $isActive }) => $isActive && theme.color.forestGreen};
  ${({ $isActive }) =>
    $isActive &&
    css`
      animation: pulse 1s linear infinite;
    `}

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const inputButtonStyles = css`
  width: 1.2rem;
`;

export const EyeIcon = styled(Eye)`
  ${inputButtonStyles}
`;

export const EyeSlashIcon = styled(EyeSlash)`
  ${inputButtonStyles}
  scale: 1.1;
`;

const rotateIconStyles = css`
  width: 1rem;
  margin: 2px 15px 0;
`;

export const UndoIcon = styled(Rotate)`
  ${rotateIconStyles}
`;

export const RedoIcon = styled(Rotate)`
  ${rotateIconStyles}
  transform: scaleX(-1);
`;

const circleIconStyles = css`
  width: 2rem;
  margin-left: 20px;
`;

export const CircleCheckIcon = styled(CircleCheck)`
  ${circleIconStyles}
  color: ${({ theme }) => theme.color.forestGreen};
`;

export const CircleInfoIcon = styled(CircleInfo)`
  ${circleIconStyles}
  color: ${({ theme }) => theme.color.blue};
`;

export const CircleWarningIcon = styled(CircleWarning)`
  ${circleIconStyles}
  color: ${({ theme }) => theme.color.crimson};
`;

export const CircleLoadingIcon = styled(CircleLoading)`
  ${circleIconStyles}
  color: ${({ theme }) => theme.color.blue};
  animation: spin 700ms linear infinite;

  @keyframes spin {
    0% {
      transform: Rotate(0deg);
    }
    100% {
      transform: Rotate(360deg);
    }
  }
`;

export const CircleIcon = styled(Circle)<CircleIconProps>`
  margin-right: 10px;
  scale: 1.3;
  padding-top: 1px;

  ${({ $isActive }) =>
    $isActive &&
    css`
      margin-left: 8px;
      scale: 1.6;
      padding-top: 3px;
    `};

  filter: brightness(140%);
  color: ${({
    theme,
    $isPending,
    $isUpdated,
    $isChanged,
    $isError,
    $isActive,
  }) => {
    if ($isError) return theme.color.red;
    if ($isChanged) return theme.color.yellow;
    if ($isPending) return theme.color.blue;
    if ($isUpdated || $isActive) return theme.color.forestGreen;
    return theme.color.black;
  }};
`;

const ArrowIconStyles = css`
  width: 0.6rem;
  scale: 1.5;
`;

export const ArrowUpIcon = styled(ArrowUp)`
  ${ArrowIconStyles}
`;

export const ArrowDownIcon = styled(ArrowUp)`
  ${ArrowIconStyles}
  rotate: 180deg;
`;
