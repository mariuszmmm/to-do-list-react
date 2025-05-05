import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useValidation } from "../../../hooks/useValidation";
import { useAppDispatch } from "../../../hooks/redux";
import { Form } from "../../../common/Form";
import { Input } from "../../../common/Input";
import { Info } from "../../../common/Info";
import { FormButton } from "../../../common/FormButton";
import { InputWrapper } from "../../../common/InputWrapper";
import { InputButton } from "../../../common/InputButton";
import { EyeIcon, EyeSlashIcon } from "../../../common/icons";
import { auth } from "../../../api/auth";
import {
  clearSessionStorage,
  getRecoveryTokenFromSessionStorage,
} from "../../../utils/sessionStorage";
import { openModal } from "../../../Modal/modalSlice";
import { useTranslation } from "react-i18next";
import { RecoveryStatus } from "../../../types";

interface Props {
  setStatus: (status: RecoveryStatus) => void;
}

export const AccountRecoveryForm = ({ setStatus }: Props) => {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string>("");
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const dispatch = useAppDispatch();
  const user = auth.currentUser();

  useEffect(() => {
    const recover = async () => {
      try {
        dispatch(
          openModal({
            title: { key: "modal.accountRecovery.title" },
            message: { key: "modal.accountRecovery.message.loading" },
            type: "loading",
          })
        );
        const token = getRecoveryTokenFromSessionStorage();
        if (!token) throw new Error();
        await auth.recover(token);
        dispatch(
          openModal({
            message: { key: "modal.accountRecovery.message.success" },
            confirmButton: { key: "modal.buttons.nextButton" },
            type: "success",
          })
        );
      } catch (error) {
        dispatch(
          openModal({
            message: { key: "modal.accountRecovery.message.error.linkExpired" },
            type: "error",
          })
        );
        setStatus("linkExpired");
        clearSessionStorage();
      }
    };

    recover();
  }, [dispatch, setStatus]);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { passwordValidation } = useValidation({
    password,
    passwordInputRef,
    message,
    setMessage,
  });

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!passwordValidation()) return;
    try {
      dispatch(
        openModal({
          title: { key: "modal.passwordChange.title" },
          message: { key: "modal.passwordChange.message.loading" },
          type: "loading",
        })
      );
      if (!user) throw new Error();
      await user.update({ password }).then((user) => user.logout());
      dispatch(
        openModal({
          message: { key: "modal.passwordChange.message.success" },
          type: "success",
        })
      );
      setPassword("");
      setStatus("accountRecovered");
      clearSessionStorage();
    } catch (error) {
      dispatch(
        openModal({
          message: { key: "modal.passwordChange.message.error.default" },
          type: "error",
        })
      );
    }
  };

  return (
    <>
      <Form $singleInput onSubmit={onFormSubmit}>
        <InputWrapper>
          <Input
            value={password}
            name="password"
            type="password"
            placeholder={t("form.inputPlaceholders.newPassword")}
            onChange={({ target }) => setPassword(target.value)}
            ref={passwordInputRef}
          />
          <InputButton
            onMouseUp={() => setShowPassword(false)}
            onMouseDown={() => setShowPassword(true)}
            onTouchStart={() => setShowPassword(true)}
            onTouchEnd={() => setShowPassword(false)}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </InputButton>
        </InputWrapper>
        <FormButton type="submit" $singleInput>
          {t("form.buttons.save")}
        </FormButton>
        {!!message && <Info $warning>{message}</Info>}
      </Form>
    </>
  );
};
