import { useState, useEffect } from "react";
import {
  getAutoRefreshSettingFromLocalStorage,
  saveAutoRefreshSettingInLocalStorage,
} from "../../../utils/storage/localStorage";
import { useAppSelector } from "../../../hooks/redux/redux";
import { selectLoggedUserEmail } from "../accountSlice";
import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../common/StyledList";
import { CheckboxContainer } from "../../../common/CheckboxContainer";
import { StyledCheckbox } from "../../../common/StyledCheckbox";
import { FieldDescription } from "../../../common/FieldDescription";
import { CheckboxFieldLabel } from "../../../common/CheckboxFieldLabel";

export const AutoRefreshToggle = () => {
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.autoRefresh",
  });
  const [autoRefreshEnabled, setAutoRefreshEnabledState] = useState(() => getAutoRefreshSettingFromLocalStorage());

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
    <CheckboxFieldLabel>
      <CheckboxContainer>
        <StyledCheckbox
          type='checkbox'
          checked={autoRefreshEnabled}
          onChange={handleToggle}
          aria-label='Toggle automatic token refresh'
          $isChecked={autoRefreshEnabled}
        />
        <StyledSpan>{t("label")}</StyledSpan>
      </CheckboxContainer>

      <FieldDescription $comment>
        {autoRefreshEnabled ? t("enabledDescription") : t("disabledDescription")}
      </FieldDescription>
    </CheckboxFieldLabel>
  );
};
