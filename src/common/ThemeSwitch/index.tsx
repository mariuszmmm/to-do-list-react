import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Wrapper, Switch, IconWrapper, Icon } from "./styled";
import { selectIsDarkTheme, toggleTheme } from "./themeSlice";

export const ThemeSwitch = ({ authRoutes }: { authRoutes: string[] }) => {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);
  const { pathname } = useLocation();
  const authRoute = authRoutes.includes(pathname);

  if (authRoute) return null;

  return (
    <Wrapper aria-label='Toggle dark mode' onClick={() => dispatch(toggleTheme())}>
      <Switch>
        <IconWrapper $moveToRight={isDarkTheme}>
          <Icon />
        </IconWrapper>
      </Switch>
    </Wrapper>
  );
};
