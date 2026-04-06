import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { ReactComponent as user } from "../images/user.svg";
import { ReactComponent as user_1 } from "../images/user_1.svg";

interface LangDropdownProps {
  $isOpen?: boolean;
}

export const LangDropdown = styled.ul<LangDropdownProps>`
  display: flex;
  position: absolute;
  left: -20px;
  top: calc(100% + 17px);
  z-index: 1001;
  min-width: 60px;
  padding: 15px 0 10px 0;
  list-style: none;
  padding-top: 10px;
  background-color: ${({ theme }) => theme.colors.nav.background};
  flex-direction: column;
  align-items: center;
  gap: 20px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(-100%)"};
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const LangDesktop = styled.div`
  display: flex;
  gap: 14px;
  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    display: none;
  }
`;

export const LangMobileWrapper = styled.div`
  position: relative;
  display: none;
  padding-left: 1px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    display: inline-block;
  }
`;

export const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.nav.background};
  /* transition: background-color 0.5s ease-in-out; */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  min-width: 300px;
  width: 100%;
  z-index: 1000;
`;
interface NavListProps {
  $isLists: boolean;
}

export const NavList = styled.ul<NavListProps>`
  list-style: none;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto auto 1fr;
  gap: clamp(10px, 5vw, 50px);
  padding: 0;
  min-width: max-content;
  width: 100%;

  ${({ $isLists }) =>
    $isLists &&
    css`
      grid-template-columns: 1fr auto auto auto 1fr;
    `};
`;

interface NavListItemProps {
  $first?: boolean;
  $last?: boolean;
  $main?: boolean;
}

export const NavListItem = styled.li<NavListItemProps>`
  ${({ $main }) =>
    $main &&
    css`
      text-align: right;
    `}

  ${({ $first }) =>
    $first &&
    css`
      text-align: left;
      margin-left: 20px;
    `}

  ${({ $last }) =>
    $last &&
    css`
      margin-right: 20px;
    `}
`;

interface StyledNavLinkProps {
  $inactive?: boolean;
  width?: string;
}

export const StyledNavLink = styled(NavLink)<StyledNavLinkProps>`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.nav.text};
  transition: color 0.2s ease-in-out;
  width: ${({ width }) => width || "auto"};
  display: inline-block;
  text-align: center;
  min-width: fit-content;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }

  &.active {
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    ${({ $inactive }) =>
      $inactive &&
      css`
        font-weight: ${({ theme }) => theme.fontWeight.normal};
      `}
  }
`;

interface ButtonProps {
  $isActive?: boolean;
  width?: string;
}

export const NavButton = styled.button<ButtonProps>`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.nav.text};
  width: ${({ width }) => width || "auto"};
  cursor: pointer;
  text-underline-offset: 5px;
  padding: 0;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    text-decoration: underline;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      font-weight: ${({ theme }) => theme.fontWeight.bold};
    `};
`;

interface AccountProps {
  $isActive?: boolean;
}

export const Account = styled(user)<AccountProps>`
  margin-top: 0.2rem;
  width: 0.9rem;
  transition: scale 0.1s ease-in-out;

  &:hover {
    scale: 1.1;
  }
`;

export const ActiveAccount = styled(user_1)<AccountProps>`
  margin-top: 0.2rem;
  scale: 1.1;
  width: 0.9rem;

  ${({ $isActive }) =>
    $isActive &&
    css`
      scale: 1.1;
    `};
`;
