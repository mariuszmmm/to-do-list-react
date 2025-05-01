import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { Nav, NavList, StyledNavLink, Account, NavButton } from "./styled";
import { auth } from "../api/auth";
import {
  setAccountMode,
  setLoggedUserEmail,
} from "../features/AccountPage/accountSlice";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { ListsData } from "../types";

type Props = { listsData?: ListsData; authRoutes: string[] };

const Navigation = ({ listsData, authRoutes }: Props) => {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "navigation",
  });
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const user = auth.currentUser();
  const authRoute = authRoutes.includes(pathname);

  useEffect(() => {
    if (!authRoute && user) {
      dispatch(setAccountMode(user ? "logged" : "login"));
      dispatch(setLoggedUserEmail(user ? user.email : null));
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "gotrue.user") window.location.reload();
    };

    if (!authRoutes) window.addEventListener("storage", handleStorageEvent);

    return () => window.removeEventListener("storage", handleStorageEvent);

    // eslint-disable-next-line
  }, []);

  return (
    <Nav>
      {!authRoute && (
        <NavList $isLists={!!listsData}>
          <li>
            {supportedLanguages.map((lang) => (
              <NavButton
                onClick={() => i18n.changeLanguage(lang)}
                $isActive={i18n.language.split("-")[0] === lang}
                key={lang}
              >
                {lang.toUpperCase()}
              </NavButton>
            ))}
          </li>
          <li>
            <StyledNavLink to="/tasks" $inactive={pathname !== "/tasks"}>
              {t("tasksPage")}
            </StyledNavLink>
          </li>
          {!!listsData && (
            <li>
              <StyledNavLink to="/lists">{t("lists")}</StyledNavLink>
            </li>
          )}
          <li>
            <StyledNavLink to="/author">{t("author")} </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/account">
              <Account $isActive={pathname === "/account"} />
            </StyledNavLink>
          </li>
        </NavList>
      )}
    </Nav>
  );
};

export default Navigation;
