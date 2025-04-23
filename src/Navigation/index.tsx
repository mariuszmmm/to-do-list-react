import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Nav, NavList, StyledNavLink, Account, NavButton } from "./styled";
import { auth } from "../api/auth";
import {
  selectLoggedUserEmail,
  setAccountMode,
  setLoggedUserEmail,
} from "../features/AccountPage/accountSlice";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { refreshData } from "../utils/refreshData";
import { useQuery } from "@tanstack/react-query";

const Navigation = () => {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "navigation",
  });
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const user = auth.currentUser();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);

  const { data } = useQuery({
    queryKey: ["lists"],
    queryFn: refreshData,
    enabled: !!loggedUserEmail,
  });

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
          <NavList $isLists={!!data && !!loggedUserEmail}>
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
            {!!data && !!loggedUserEmail && (
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
