import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background-color: ${({ theme }) => theme.color.teal};
  display: flex;
  justify-content: center;
  height: 50px;
`;

export const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 50px;
`;

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.color.white};

  &.active{
    font-weight: 700;
  }
`;