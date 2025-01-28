import { useSelector } from "react-redux";
import { Nav, NavList, StyledNavLink, User } from "./styled";
import { selectUser } from "../features/Account/loginSlice";

const Navigation = () => {
  const user = useSelector(selectUser);

  return (
    <Nav>
      <NavList $isLists={!!user}>
        <li></li>
        <li>
          <StyledNavLink to="/zadania">Zadania</StyledNavLink>
        </li>
        {user && (
          <li>
            <StyledNavLink to="/listy">Listy</StyledNavLink>
          </li>
        )}
        <li>
          <StyledNavLink to="/autor">O autorze</StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/konto">
            <User />
          </StyledNavLink>
        </li>
      </NavList>
    </Nav>
  );
};

export default Navigation;
