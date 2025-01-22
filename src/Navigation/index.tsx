import { Nav, NavList, StyledNavLink, Account } from "./styled";
import { useLocation } from "react-router-dom";
import { selectLists } from "../features/ListsPage/listsSlice";
import { useAppSelector } from "../hooks";

const Navigation = () => {
  const lists = useAppSelector(selectLists);
  const { pathname } = useLocation();

  return (
    <Nav>
      <NavList
        $isLists={lists !== null}
        $noDisplay={
          pathname !== "/user-confirmation" && pathname !== "/password-recovery"
        }
      >
        <li></li>
        <li>
          <StyledNavLink to="/zadania">Zadania</StyledNavLink>
        </li>
        {lists !== null && (
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
