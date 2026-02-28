import { SubmitEventHandler, useRef, useState } from "react";
import { useValidation } from "../../../hooks/validation/useValidation";
import { useAppDispatch } from "../../../hooks/redux/redux";
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
  getInviteTokenFromSessionStorage,
} from "../../../utils/storage/sessionStorage";
import { openModal } from "../../../Modal/modalSlice";
import { useTranslation } from "react-i18next";
import { RecoveryStatus } from "../../../types";

interface Props {
  setStatus: (status: RecoveryStatus) => void;
}

export const UserInvitationForm = ({ setStatus }: Props) => {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string>("");
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const dispatch = useAppDispatch();

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { passwordValidation } = useValidation({
    password,
    passwordInputRef,
    message,
    setMessage,
  });

  const onFormSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!passwordValidation()) return;
    try {
      dispatch(
        openModal({
          title: { key: "modal.userInvitation.title" },
          message: { key: "modal.userInvitation.message.loading" },
          type: "loading",
        }),
      );

      const token = getInviteTokenFromSessionStorage();
      if (!token) throw new Error("No token");

      await auth.acceptInvite(token, password, true);

      dispatch(
        openModal({
          title: { key: "modal.userInvitation.title" },
          message: { key: "modal.userInvitation.message.success" },
          type: "success",
        }),
      );
      setPassword("");
      setStatus("accountRecovered");
      clearSessionStorage();
    } catch (error) {
      dispatch(
        openModal({
          title: { key: "modal.userInvitation.title" },
          message: { key: "modal.userInvitation.message.error.default" },
          type: "error",
        }),
      );
      setStatus("linkExpired");
      clearSessionStorage();
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
            onPointerDown={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
            type="button"
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
