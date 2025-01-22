import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useValidation } from "../../../hooks/useValidation";
import { Form } from "../../../common/Form";
import { Input } from "../../../common/Input";
import { Info } from "../../../common/Info";
import { FormButton } from "../../../common/FormButton";
import { auth } from "../../../utils/auth";
import { AccountRecoveryModal } from "../AccountRecoveryModal";
import { getRecoveryTokenFromSessionStorage } from "../../../utils/sessionStorage";
import { RecoveryStatus } from "../../../types";

export const AccountRecoveryForm = () => {
  const [recoveryStatus, setRecoveryStatus] =
    useState<RecoveryStatus>("recovering");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const user = auth.currentUser();

  useEffect(() => {
    const recover = async () => {
      try {
        const token = getRecoveryTokenFromSessionStorage();
        if (!token) throw new Error();
        await auth.recover(token);
        setRecoveryStatus("resetPassword");
      } catch (error) {
        setRecoveryStatus("linkExpired");
      }
    };

    recover();
  }, []);

  useEffect(() => {
    const updatePassword = async () => {
      if (!password) return;
      try {
        if (!user) throw new Error();
        await user.update({ password });
        setRecoveryStatus("passwordUpdated");
        setPassword("");
        sessionStorage.removeItem("recovery_token");
      } catch (error) {
        setRecoveryStatus("passwordNotUpdated");
      }
    };

    if (recoveryStatus === "savePassword") {
      updatePassword();
    }

    // eslint-disable-next-line
  }, [recoveryStatus]);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { passwordValidation } = useValidation({
    password,
    passwordInputRef,
    setMessage,
  });

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (message) setMessage("");

    if (!passwordValidation()) return;
    setRecoveryStatus("savePassword");
  };

  return (
    <>
      {recoveryStatus !== "resetPassword" && (
        <AccountRecoveryModal recoveryStatus={recoveryStatus} />
      )}
      <Form $singleInput onSubmit={onFormSubmit}>
        <Input
          value={password}
          name="password"
          type="password"
          placeholder="nowe hasło"
          onChange={({ target }) => setPassword(target.value)}
          ref={passwordInputRef}
          disabled={recoveryStatus !== "resetPassword"}
        />
        <FormButton
          type="submit"
          $singleInput
          disabled={recoveryStatus !== "resetPassword"}
        >
          Zapisz
        </FormButton>
        {!!message && <Info $warning>{message}</Info>}
      </Form>
    </>
  );
};
