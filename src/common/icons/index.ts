import styled, { css } from "styled-components";
import { ReactComponent as Rotate } from "../../images/rotate.svg";
import { ReactComponent as CircleCheck } from "../../images/circle-check.svg";
import { ReactComponent as CircleInfo } from "../../images/circle-info.svg";
import { ReactComponent as CircleWarning } from "../../images/circle-warning.svg";
import { ReactComponent as CircleLoading } from "../../images/circle-loading.svg";
import { ReactComponent as Eye } from "../../images/eye.svg";
import { ReactComponent as EyeSlash } from "../../images/eye-slash.svg";
import { ReactComponent as ArrowUp } from "../../images/arrow-up.svg";

const eyeIconStyles = css`
  width: 1.2rem;
  color: ${({ theme }) => theme.color.empress};
  cursor: pointer;
`;

export const EyeIcon = styled(Eye)`
  ${eyeIconStyles}
  width: 1.1rem;
`;

export const EyeSlashIcon = styled(EyeSlash)`
  ${eyeIconStyles}
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
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
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
