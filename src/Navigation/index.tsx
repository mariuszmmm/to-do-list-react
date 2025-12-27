import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Nav, NavList, StyledNavLink, Account, NavButton } from "./styled";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { ListsData } from "../types";
import { Loader } from "../common/Loader";
import { auth } from "../api/auth";

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
