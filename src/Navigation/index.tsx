import { Nav, NavList, StyledNavLink } from "./styled";

const Navigation = () => (
  <Nav>
    <NavList>
      <li>
        <StyledNavLink to="/zadania">Zadania</StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/listy">Listy</StyledNavLink>
      </li>
      <li>
        <StyledNavLink to="/autor">O autorze</StyledNavLink>
      </li>
    </NavList>
  </Nav>
);

export default Navigation;
