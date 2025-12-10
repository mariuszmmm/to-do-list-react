import { useState, useEffect } from "react";
import { UniversalContainer } from "../../../common/UniversalContainer";
import styled, { DefaultTheme } from "styled-components";
import {
  getAutoRefreshSettingFromLocalStorage,
  saveAutoRefreshSettingInLocalStorage,
} from "../../../utils/localStorage";
import { useAppSelector } from "../../../hooks/redux";
import { selectLoggedUserEmail } from "../accountSlice";
import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../common/StyledList";

export const AutoRefreshToggle = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.autoRefresh",
  });
  const [autoRefreshEnabled, setAutoRefreshEnabledState] = useState(() =>
    getAutoRefreshSettingFromLocalStorage()
  );

  useEffect(() => {
    setAutoRefreshEnabledState(getAutoRefreshSettingFromLocalStorage());
  }, [loggedUserEmail]);

  if (!loggedUserEmail) {
    return null;
  }

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.checked;
    setAutoRefreshEnabledState(newState);
    saveAutoRefreshSettingInLocalStorage(newState);
  };

  return (
    <UniversalContainer>
      <ToggleLabel>
        <CheckboxInput
          type="checkbox"
          checked={autoRefreshEnabled}
          onChange={handleToggle}
          aria-label="Toggle automatic token refresh"
        />
        <StyledSpan>
          {t("label")}
        </StyledSpan>
      </ToggleLabel>
      <ToggleDescription $comment>
        {autoRefreshEnabled
          ? t("enabledDescription")
          : t("disabledDescription")}
      </ToggleDescription>
    </UniversalContainer>
  );
};

// ...usunięto ToggleContainer, używaj UniversalContainer z common

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 4px;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }: { theme: DefaultTheme }) => theme.color.teal};
    transition: filter 0.25s;  
  
  &:hover {
    outline: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.color.teal};
    outline-offset: 1px;
  }
`;


const ToggleDescription = styled(StyledSpan)`
  font-size: 0.8rem;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.color.empress};
  margin-left: 30px;
`;
