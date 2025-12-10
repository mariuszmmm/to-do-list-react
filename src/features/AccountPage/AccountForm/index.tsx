import { FormEventHandler, useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useValidation } from "../../../hooks/useValidation";
import { useWaitingForConfirmation } from "./useWaitingForConfirmation";
import { Form } from "../../../common/Form";
import { FormButton } from "../../../common/FormButton";
import { Input } from "../../../common/Input";
import { InputButton } from "../../../common/InputButton";
import { EyeIcon, EyeSlashIcon } from "../../../common/icons";
import {
  selectAccountMode,
  selectIsWaitingForConfirmation,
  selectLoggedUserEmail,
  selectMessage,
  setMessage,
  setAccountMode,
} from "../accountSlice";
import { useTranslation } from "react-i18next";
import { useLogin } from "./useLogin";
import { useLogout } from "./useLogout";
import {
  closeModal,
  openModal,
  selectModalConfirmed,
  selectModalState,
} from "../../../Modal/modalSlice";
import { usePasswordChange } from "./usePasswordChange";
import { useAccountRecovery } from "./useAccountRecovery";
import { useAccountDelete } from "./useAccountDelete";
import { clearStorage } from "../../tasks/tasksSlice";
import { useAccountRegister } from "./useAccountRegister";
import { InputWrapper } from "../../../common/InputWrapper";

export const AccountForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const accountMode = useAppSelector(selectAccountMode);
  const message = useAppSelector(selectMessage);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const confirmed = useAppSelector(selectModalConfirmed);
  const modalState = useAppSelector(selectModalState);

  const isWaitingForConfirmation = useAppSelector(
    selectIsWaitingForConfirmation,
  );
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const dispatch = useAppDispatch();
  const { waitingForConfirmation } = useWaitingForConfirmation({
    email,
    password,
    message,
  });

  const { emailValidation, passwordValidation } = useValidation({
    email,
    password,
    emailInputRef,
    passwordInputRef,
    message,
    setMessage: (text) => dispatch(setMessage(text)),
  });

  const login = useLogin();
  const logout = useLogout();
  const changePassword = usePasswordChange();
  const accountRecovery = useAccountRecovery();
  const accountDelete = useAccountDelete();
  const accountRegister = useAccountRegister();

  useEffect(() => {
    if (isWaitingForConfirmation) {
      waitingForConfirmation();
    }
  }, [isWaitingForConfirmation, waitingForConfirmation]);

  useEffect(() => {
    const modalTitleKey = modalState.title?.key;
    const isAccountConfirmModal =
      modalState.type === "confirm" &&
      (modalTitleKey === "modal.logout.title" ||
        modalTitleKey === "modal.accountDelete.title" ||
        modalTitleKey === "modal.dataRemoval.title");

    if (!isAccountConfirmModal) return;

    if (confirmed) {
      if (modalTitleKey === "modal.logout.title" && accountMode === "logged") {
        logout.mutate();
      }

      if (modalTitleKey === "modal.accountDelete.title" && accountMode === "accountDelete") {
        accountDelete.mutate();
      }

      if (modalTitleKey === "modal.dataRemoval.title" && accountMode === "dataRemoval") {
        dispatch(clearStorage());
        dispatch(setAccountMode("login"));
        dispatch(
          openModal({
            title: { key: "modal.dataRemoval.title" },
            message: { key: "modal.dataRemoval.message.info" },
            type: "info",
          }),
        );
      }
    } else if (confirmed === false) {
      if (modalTitleKey === "modal.accountDelete.title" && accountMode === "accountDelete") {
        dispatch(setAccountMode("logged"));
      }

      if (modalTitleKey === "modal.dataRemoval.title" && accountMode === "dataRemoval") {
        dispatch(setAccountMode("login"));
      }

      dispatch(closeModal());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed, modalState, accountMode]);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    switch (accountMode) {
      case "login":
        if (!(emailValidation() && passwordValidation())) break;
        login.mutate({ email, password });
        setPassword("");
        break;
      case "accountRegister":
        if (!emailValidation() || !passwordValidation()) break;
        accountRegister.mutate({ email, password });
        break;
      case "accountRecovery":
        if (!emailValidation()) break;
        accountRecovery.mutate({ email });
        break;
      case "passwordChange":
        if (!passwordValidation()) break;
        changePassword.mutate({ password });
        setPassword("");
        break;
      case "logged":
        dispatch(
          openModal({
            title: { key: "modal.logout.title" },
            message: { key: "modal.logout.message.confirm" },
            confirmButton: { key: "modal.buttons.logoutButton" },
            type: "confirm",
          }),
        );
        setPassword("");
        break;
    }
  };

  useEffect(() => {
    if (accountMode === "passwordChange") {
      setPassword("");
    }
  }, [accountMode]);

  return (
    <>
      <Form
        onSubmit={onFormSubmit}
        $singleInput={
          accountMode === "accountRecovery" || accountMode === "passwordChange"
        }
        $noInputs={!!loggedUserEmail && accountMode !== "passwordChange"}
      >
        <Input
          autoFocus
          value={email}
          type="email"
          name="login"
          placeholder={t("form.inputPlaceholders.email")}
          onChange={({ target }) => setEmail(target.value)}
          ref={emailInputRef}
          hidden={!!loggedUserEmail}
        />
        <InputWrapper
          hidden={
            (!!loggedUserEmail || accountMode === "accountRecovery") &&
            accountMode !== "passwordChange"
          }
        >
          <Input
            value={password}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={
              accountMode === "passwordChange"
                ? t("form.inputPlaceholders.newPassword")
                : t("form.inputPlaceholders.password")
            }
            autoComplete={
              accountMode === "passwordChange" ? "new-password" : ""
            }
            onChange={({ target }) => setPassword(target.value)}
            ref={passwordInputRef}
          />
          <InputButton
            onMouseUp={() => setShowPassword(false)}
            onMouseDown={() => setShowPassword(true)}
            onTouchStart={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </InputButton>
        </InputWrapper>
        <FormButton
          type="submit"
          $singleInput={
            accountMode === "accountRecovery" ||
            accountMode === "passwordChange"
          }
          $noInputs={!!loggedUserEmail && accountMode !== "passwordChange"}
        >
          {accountMode === "accountRegister"
            ? t("form.buttons.register")
            : accountMode === "accountRecovery"
              ? t("form.buttons.reset")
              : accountMode === "passwordChange"
                ? t("form.buttons.save")
                : loggedUserEmail
                  ? t("form.buttons.logout")
                  : t("form.buttons.login")}
        </FormButton>
      </Form>
    </>
  );
};
