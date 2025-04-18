import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import {
  selectAccountMode,
  setAccountMode,
  selectLoggedUserEmail,
  deleteAccountRequest,
} from "../accountSlice";
import { useTranslation } from "react-i18next";

export const AccountButtons = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const dispatch = useAppDispatch();

  return (
    <ButtonsContainer>
      {!loggedUserEmail ? (
        <>
          <Button
            onClick={() => dispatch(setAccountMode("login"))}
            $selected={accountMode === "login"}
          >
            {t("buttons.login")}
          </Button>
          <Button
            onClick={() => dispatch(setAccountMode("accountRegister"))}
            $selected={accountMode === "accountRegister"}
          >
            {t("buttons.register")}
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              dispatch(deleteAccountRequest());
              dispatch(setAccountMode("logged"));
            }}
          >
            {t("buttons.accountDelete")}
          </Button>
          <Button
            onClick={() => dispatch(setAccountMode("passwordChange"))}
            $selected={accountMode === "passwordChange"}
          >
            {t("buttons.passwordChange")}
          </Button>
        </>
      )}
    </ButtonsContainer>
  );
};
