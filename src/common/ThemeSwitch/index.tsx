import { useAppDispatch, useAppSelector } from "../../hooks";
import { Wrapper, Switch, IconWrapper, Icon } from "./styled";
import { selectIsDarkTheme, toggleTheme } from "./themeSlice";

export const ThemeSwitch = () => {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(selectIsDarkTheme);

  return (
    <Wrapper onClick={() => dispatch(toggleTheme())}>
      <Switch>
        <IconWrapper $moveToRight={isDarkTheme}>
          <Icon />
        </IconWrapper>
      </Switch>
    </Wrapper>
  );
};
