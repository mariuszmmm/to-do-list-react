import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Nav, NavList, Account, NavButton, ActiveAccount } from "./styled";
import { AutoMinWidthNavLink } from "./AutoMinWidthNavLink";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { ListsData } from "../types";
import { Loader } from "../common/Loader";
import { auth } from "../api/auth";
import { useAppSelector } from "../hooks";
import { selectIsDarkTheme } from "../common/ThemeSwitch/themeSlice";

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
  const authRoute = authRoutes.includes(pathname);
  const user = auth.currentUser();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);

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
            <AutoMinWidthNavLink to="/tasks" $inactive={pathname !== "/tasks"} text={t("tasksPage")}>
              {t("tasksPage")}
            </AutoMinWidthNavLink>
          </li>
          {!!user && !isError && (
            <li>
              {isLoading ? (
                <Loader isDarkTheme={isDarkTheme} />
              ) : !!listsData ? (
                <AutoMinWidthNavLink to="/lists" text={t("lists")}>{t("lists")}</AutoMinWidthNavLink>
              ) : null}
            </li>
          )}
          <li>
            <AutoMinWidthNavLink to="/info" text={t("info")}>{t("info")}</AutoMinWidthNavLink>
          </li>
          <li>
            <AutoMinWidthNavLink to="/account" text={"Account"}>
              {pathname === "/account" ? <ActiveAccount /> : <Account />}
            </AutoMinWidthNavLink>
          </li>
        </NavList>
      )}
    </Nav>
  );
};

export default Navigation;
