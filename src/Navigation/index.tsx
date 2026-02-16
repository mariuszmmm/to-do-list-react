import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Nav, NavList, Account, ActiveAccount, NavListItem } from "./styled";
import LangSwitcherDesktop from "./LangSwitcherDesktop";
import LangSwitcherMobile from "./LangSwitcherMobile";
import { AutoMinWidthNavLink } from "./AutoMinWidthNavLink";
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
          <NavListItem $first $main>
            <LangSwitcherDesktop />
            <LangSwitcherMobile />
          </NavListItem>
          <NavListItem $main>
            <AutoMinWidthNavLink to='/tasks' $inactive={pathname !== "/tasks"} text={t("tasksPage")}>
              {t("tasksPage")}
            </AutoMinWidthNavLink>
          </NavListItem>
          {!!user && !isError && (
            <NavListItem $main>
              {isLoading ? (
                <Loader isDarkTheme={isDarkTheme} />
              ) : !!listsData ? (
                <AutoMinWidthNavLink to='/lists' text={t("lists")}>
                  {t("lists")}
                </AutoMinWidthNavLink>
              ) : null}
            </NavListItem>
          )}
          <NavListItem $main>
            <AutoMinWidthNavLink to='/info' text={t("info")}>
              {t("info")}
            </AutoMinWidthNavLink>
          </NavListItem>
          <NavListItem $last $main>
            <AutoMinWidthNavLink to='/account' text={""}>
              {pathname === "/account" ? <ActiveAccount /> : <Account />}
            </AutoMinWidthNavLink>
          </NavListItem>
        </NavList>
      )}
    </Nav>
  );
};

export default Navigation;
