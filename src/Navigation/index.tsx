import { useSelector } from "react-redux";
import { Nav, NavList, StyledNavLink, Account } from "./styled";
import { selectUserData } from "../features/AccountPage/loginSlice";

const Navigation = () => {
  const userData = useSelector(selectUserData);

  return (
    <Nav>
      <NavList $isLists={!!userData}>
        <li></li>
        <li>
          <StyledNavLink to="/zadania">Zadania</StyledNavLink>
        </li>
        {userData && (
          <li>
            <StyledNavLink to="/listy">Listy</StyledNavLink>
          </li>
        )}
        <li>
          <StyledNavLink to="/autor">O autorze</StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/konto">
            <Account />
          </StyledNavLink>
        </li>
      </NavList>
    </Nav>
  );
};

export default Navigation;
