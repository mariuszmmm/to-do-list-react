import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { ReactComponent as user } from "../images/user.svg";
import { ReactComponent as user_1 } from "../images/user_1.svg";

interface NavListProps {
  $isLists: boolean;
}
interface ButtonProps {
  $isActive?: boolean;
}

interface StyledNavLinkProps {
  $inactive?: boolean;
}
interface AccountProps {
  $isActive?: boolean;
}

export const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.nav.background};
  transition: background-color 0.5s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  user-select: none;
  position: fixed;
  min-width: 300px;
  width: 100%;
  z-index: 10;
`;

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

  li {
    text-align: right;
  }

  li:first-child {
    text-align: left;
    margin-left: 20px;
  }

  li:last-child {
    margin-right: 20px;
  }
`;

export const StyledNavLink = styled(NavLink)<StyledNavLinkProps>`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.nav.text};
  transition: color 0.2s ease-in-out;

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

export const NavButton = styled.button<ButtonProps>`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.nav.text};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
  ${({ $isActive }) =>
    $isActive &&
    css`
      font-weight: ${({ theme }) => theme.fontWeight.bold};
    `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    display: none;
  }
`;

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
