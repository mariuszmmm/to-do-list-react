import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  Nav,
  NavList,
  Account,
  ActiveAccount,
  NavListItem,
  StyledNavLink,
} from "./styled";
import { LangSwitcherDesktop } from "./LangSwitcherDesktop";
import { LangSwitcherMobile } from "./LangSwitcherMobile";
import { ListsData } from "../types";
import { Loader } from "../common/Loader";
import { auth } from "../api/auth";
import { useAppSelector } from "../hooks";
import { selectIsDarkTheme } from "../common/ThemeSwitch/themeSlice";
import {
  getWidthForInfoNavButton,
  getWidthForListsNavButton,
  getWidthForTasksNavButton,
} from "../utils/ui/getWidthForDynamicButtons";

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
    <>
      {!authRoute && (
        <Nav>
          <NavList $isLists={!!user && !isError}>
            <NavListItem $first $main>
              <LangSwitcherDesktop />
              <LangSwitcherMobile />
            </NavListItem>

            <NavListItem $main>
              <StyledNavLink
                to="/tasks"
                $inactive={pathname !== "/tasks"}
                width={getWidthForTasksNavButton(i18n.language)}
              >
                {t("tasksPage")}
              </StyledNavLink>
            </NavListItem>
            {!!user && !isError && (
              <NavListItem $main>
                {isLoading ? (
                  <Loader isDarkTheme={isDarkTheme} />
                ) : !!listsData ? (
                  <StyledNavLink
                    to="/lists"
                    width={getWidthForListsNavButton(i18n.language)}
                  >
                    {t("lists")}
                  </StyledNavLink>
                ) : null}
              </NavListItem>
            )}
            <NavListItem $main>
              <StyledNavLink
                to="/info"
                width={getWidthForInfoNavButton(i18n.language)}
              >
                {t("info")}
              </StyledNavLink>
            </NavListItem>
            <NavListItem $last $main>
              <StyledNavLink to="/account">
                {pathname === "/account" ? <ActiveAccount /> : <Account />}
              </StyledNavLink>
            </NavListItem>
          </NavList>
        </Nav>
      )}
    </>
  );
};

export default Navigation;
