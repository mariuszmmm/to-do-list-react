import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background-color: ${({ theme }) => theme.color.teal};
  display: flex;
  justify-content: center;
  height: 50px;
  user-select: none;
  position: fixed;
  width: 100%;
`;

export const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 50px;
  padding: 0;
  min-width: max-content;
`;

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.color.white};

  &:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }

  &.active {
    font-weight: 700;
  }
`;
