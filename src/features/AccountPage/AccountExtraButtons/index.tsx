import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import { Info } from "../../../common/Info";
import {
  selectAccountMode,
  selectLoggedUserEmail,
  selectMessage,
  setAccountMode,
} from "../accountSlice";
import { useTranslation } from "react-i18next";
import { AutoRefreshToggle } from "../AutoRefreshToggle";

export const AccountExtraButtons = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const message = useAppSelector(selectMessage);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const dispatch = useAppDispatch();

  return (
    <>
      <ButtonsContainer $extra>
        {!loggedUserEmail
          ? (accountMode === "login" || accountMode === "accountRecovery") && (
            <Button
              $special
              onClick={() =>
                dispatch(
                  setAccountMode(
                    accountMode === "login" ? "accountRecovery" : "login",
                  ),
                )
              }
            >
              {accountMode === "login"
                ? t("buttons.resetPassword")
                : t("buttons.cancel")}
            </Button>
          )
          : accountMode === "passwordChange" && (
            <Button $special onClick={() => dispatch(setAccountMode("logged"))}>
              {t("buttons.cancel")}
            </Button>
          )}

        {!!message && <Info $warning>{message}</Info>}
      </ButtonsContainer>
      <AutoRefreshToggle />
    </>
  );
};