import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as user } from "../images/user.svg";

export const Nav = styled.nav`
  background-color: ${({ theme }) => theme.color.teal};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  user-select: none;
`;

export const NavList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr auto auto 1fr;
  width: 100%;
  gap: clamp(10px, 5vw, 50px);
  padding: 0;

  li {
    text-align: right;
  };
`;

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.color.white};
  height: 50px;

  &:hover{
    text-decoration: underline;
    text-underline-offset: 5px
  }

  &.active{
    font-weight: 700;
  }
`;

export const User = styled(user)`
  margin-top: 0.1rem;
  margin-right: 20px;
  width: 0.8rem;
`;
