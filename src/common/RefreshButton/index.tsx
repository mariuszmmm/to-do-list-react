import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RefreshButtonStyled = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.button.check};
  cursor: pointer;
  padding: 4px 8px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 130px;
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  border-radius: 20px;
  transition: all 0.2s;
  border: 1px solid transparent;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecendary};
    border-color: ${({ theme }) => theme.colors.button.check};
  }

  svg {
    transition: transform 0.3s;
  }

  &:disabled svg {
    animation: ${rotate} 1s linear infinite;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    padding: 4px 10px;
    font-size: 0.7rem;
    gap: 4px;
    margin-left: 5px;
  }
`;

const RefreshIconSVG = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

interface RefreshButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  isLoading,
  children,
  type = "button",
  ...props
}) => (
  <RefreshButtonStyled
    disabled={isLoading || props.disabled}
    type={type}
    {...props}
  >
    <RefreshIconSVG />
    {children}
  </RefreshButtonStyled>
);
