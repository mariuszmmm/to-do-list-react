import { Nav, NavList, StyledNavLink, User } from "./styled";

const Navigation = () => (
  <Nav>
    <NavList>
      <li></li>
      <li><StyledNavLink to="/zadania">Zadania</StyledNavLink></li>
      <li><StyledNavLink to="/autor">O autorze</StyledNavLink></li>
      <li><StyledNavLink to="/login"><User /></StyledNavLink></li>
    </NavList>
  </Nav>
);

export default Navigation;