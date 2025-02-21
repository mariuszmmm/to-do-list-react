import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { ReactComponent as user } from "../images/user.svg";

interface NavListProps {
  $isLists: boolean;
}

export const Nav = styled.nav`
  background-color: ${({ theme }) => theme.color.teal};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  user-select: none;
  position: fixed;
  min-width: 300px;
  width: 100%;
  z-index: 1;
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
`;

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.color.white};
  height: 50px;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }

  &.active {
    font-weight: 700;
  }
`;

export const Account = styled(user)`
  margin-top: 0.1rem;
  margin-right: 20px;
  width: 0.9rem;
`;
