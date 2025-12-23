import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useTranslation } from "react-i18next";
import { openModal } from "../../../Modal/modalSlice";
import {
  selectAccountMode,
  setAccountMode,
  selectLoggedUserEmail,
} from "../accountSlice";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
export const AccountActions = () => {
  const accountMode = useAppSelector(selectAccountMode);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  const handleLogin = () => dispatch(setAccountMode("login"));
  const handleRegister = () => dispatch(setAccountMode("accountRegister"));
  const handleAccountDelete = () => {
    dispatch(setAccountMode("accountDelete"));
    dispatch(
      openModal({
        title: { key: "modal.accountDelete.title" },
        message: { key: "modal.accountDelete.message.confirm" },
        confirmButton: { key: "modal.buttons.deleteButton" },
        type: "confirm",
      }),
    );
  };
  const handlePasswordChange = () => dispatch(setAccountMode("passwordChange"));

  return (
    <ButtonsContainer>
      {!loggedUserEmail ? (
        <>
          <Button onClick={handleLogin} $selected={accountMode === "login"}>
            {t("buttons.login")}
          </Button>
          <Button
            onClick={handleRegister}
            $selected={accountMode === "accountRegister"}
          >
            {t("buttons.register")}
          </Button>
        </>
      ) : (
        <>
          <Button onClick={handleAccountDelete}>
            {t("buttons.accountDelete")}
          </Button>
          <Button
            onClick={handlePasswordChange}
            $selected={accountMode === "passwordChange"}
          >
            {t("buttons.passwordChange")}
          </Button>
        </>
      )}
    </ButtonsContainer>
  );
};
