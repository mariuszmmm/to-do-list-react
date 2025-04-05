import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Nav, NavList, StyledNavLink, Account, NavButton } from "./styled";
import { selectLists } from "../features/ListsPage/listsSlice";
import { auth } from "../api/auth";
import {
  setAccountMode,
  setLoggedUserEmail,
} from "../features/AccountPage/accountSlice";
import { supportedLanguages } from "../utils/i18n/languageResources";

const Navigation = () => {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "navigation",
  });
  const { pathname } = useLocation();
  const lists = useAppSelector(selectLists);
  const dispatch = useAppDispatch();
  const user = auth.currentUser();

  useEffect(() => {
    if (
      pathname !== "/user-confirmation" &&
      pathname !== "/account-recovery" &&
      user
    ) {
      dispatch(setAccountMode(user ? "logged" : "login"));
      dispatch(setLoggedUserEmail(user ? user.email : null));
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "gotrue.user") {
        window.location.reload();
      }
    };

    if (pathname !== "/user-confirmation" && pathname !== "/account-recovery") {
      window.addEventListener("storage", handleStorageEvent);
    }

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };

    // eslint-disable-next-line
  }, []);

  return (
    <Nav>
      {pathname !== "/user-confirmation" &&
        pathname !== "/account-recovery" && (
          <NavList $isLists={lists !== null}>
            <li>
              {supportedLanguages.map((lang) => (
                <NavButton
                  onClick={() => i18n.changeLanguage(lang)}
                  $isActive={i18n.language === lang}
                  key={lang}
                >
                  {lang.toUpperCase()}
                </NavButton>
              ))}
            </li>
            <li>
              <StyledNavLink to="/zadania" $inactive={pathname !== "/zadania"}>
                {t("tasksPage")}
              </StyledNavLink>
            </li>
            {lists !== null && (
              <li>
                <StyledNavLink to="/listy">{t("lists")}</StyledNavLink>
              </li>
            )}
            <li>
              <StyledNavLink to="/autor">{t("author")} </StyledNavLink>
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
