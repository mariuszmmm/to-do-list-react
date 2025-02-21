import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useValidation } from "../../../hooks/useValidation";
import { Form } from "../../../common/Form";
import { Input } from "../../../common/Input";
import { Info } from "../../../common/Info";
import { FormButton } from "../../../common/FormButton";
import { auth } from "../../../api/auth";
import {
  clearSessionStorage,
  getRecoveryTokenFromSessionStorage,
} from "../../../utils/sessionStorage";
import { openModal } from "../../../Modal/modalSlice";
import { useAppDispatch } from "../../../hooks";
import { RecoveryStatus } from "..";

export const AccountRecoveryForm = ({
  setStatus,
}: {
  setStatus: (status: RecoveryStatus) => void;
}) => {
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const dispatch = useAppDispatch();
  const user = auth.currentUser();

  useEffect(() => {
    const recover = async () => {
      try {
        dispatch(
          openModal({
            title: "Odzyskiwanie konta",
            message: "Proszę czekać...",
            type: "loading",
          })
        );
        const token = getRecoveryTokenFromSessionStorage();
        if (!token) throw new Error();
        await auth.recover(token);
        dispatch(
          openModal({
            message: "Konto zostało odzyskane, ustaw nowe hasło.",
            endButtonText: "Dalej",
            type: "info",
          })
        );
      } catch (error) {
        dispatch(
          openModal({
            message: "Link wygasł lub został użyty.",
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
    setMessage,
  });

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!passwordValidation()) return;
    try {
      dispatch(
        openModal({
          title: "Odzyskiwanie konta",
          message: "Zapisywanie hasła...",
          type: "loading",
        })
      );
      if (!user) throw new Error();
      await user.update({ password }).then((user) => user.logout());
      dispatch(
        openModal({
          message: "Hasło zostało zaktualizowane, zamknij stronę.",
          type: "success",
        })
      );
      setPassword("");
      setStatus("accountRecovered");
      clearSessionStorage();
    } catch (error) {
      dispatch(
        openModal({
          message: "Wystąpił błąd podczas aktualizacji hasła.",
          type: "error",
        })
      );
    }
  };

  return (
    <>
      <Form $singleInput onSubmit={onFormSubmit}>
        <Input
          value={password}
          name="password"
          type="password"
          placeholder="nowe hasło"
          onChange={({ target }) => setPassword(target.value)}
          ref={passwordInputRef}
        />
        <FormButton type="submit" $singleInput>
          Zapisz
        </FormButton>
        {!!message && <Info $warning>{message}</Info>}
      </Form>
    </>
  );
};
