import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { Nav, NavList, StyledNavLink, Account, NavButton } from "./styled";
import { auth } from "../api/auth";
import {
  setAccountMode,
  setLoggedUser,
} from "../features/AccountPage/accountSlice";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { ListsData } from "../types";
import { Loader } from "../common/Loader";

type Props = {
  listsData?: ListsData;
  isLoading: boolean;
  isError: boolean;
  authRoutes: string[];
};

const Navigation = ({ listsData, isLoading, isError, authRoutes }: Props) => {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "navigation",
  });
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const user = auth.currentUser();
  const authRoute = authRoutes.includes(pathname);

  useEffect(() => {
    if (!authRoute && user) {

      console.log("!!!!!!!!!!!Current user found in Navigation:", user);
      dispatch(setAccountMode(user ? "logged" : "login"));
      dispatch(setLoggedUser(user ? {
        email: user.email,
        name: user?.user_metadata?.full_name,
        roles: user?.app_metadata?.roles,
      } : null));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "gotrue.user") window.location.reload();
    };

    if (!authRoutes) window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Nav>
      {!authRoute && (
        <NavList $isLists={!!user && !isError}>
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
          {!!user && !isError && (
            <li>
              {isLoading ? (
                <Loader />
              ) : !!listsData ? (
                <StyledNavLink to="/lists">{t("lists")}</StyledNavLink>
              ) : null}
            </li>
          )}
          <li>
            <StyledNavLink to="/info">{t("info")} </StyledNavLink>
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
