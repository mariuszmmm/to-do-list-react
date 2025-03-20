import { Nav, NavList, StyledNavLink, Account } from "./styled";
import { useLocation } from "react-router-dom";
import { selectLists } from "../features/ListsPage/listsSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect } from "react";
import { auth } from "../api/auth";
import {
  setAccountMode,
  setLoggedUserEmail,
} from "../features/AccountPage/accountSlice";

const Navigation = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const lists = useAppSelector(selectLists);
  const user = auth.currentUser();

  useEffect(() => {
    if (pathname !== "/user-confirmation" && pathname !== "/account-recovery") {
      dispatch(setAccountMode(user ? "logged" : "login"));
      dispatch(setLoggedUserEmail(user ? user.email : null));
    }

    // eslint-disable-next-line
  }, [user, dispatch]);

  useEffect(() => {
    if (pathname !== "/user-confirmation" && pathname !== "/account-recovery") {
      window.addEventListener("storage", (event) => {
        if (event.key === "gotrue.user") {
          window.location.reload();
        }
      });
    } else {
      window.removeEventListener("storage", () => {});
    }

    return () => {
      window.removeEventListener("storage", () => {});
    };

    // eslint-disable-next-line
  }, []);

  return (
    <Nav>
      {pathname !== "/user-confirmation" &&
        pathname !== "/account-recovery" && (
          <NavList $isLists={lists !== null}>
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
        )}
    </Nav>
  );
};

export default Navigation;
