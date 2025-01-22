import { FormEventHandler, useState } from "react";
import { useRef } from "react";
import { Button, StyledForm } from "./styled";
import { Input } from "../../../common/Input";

const LogForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const emailPattern: RegExp =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordPattern: RegExp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    setError(null);

    if (!login) {
      setError("Wpisz adres e-mail.");
      loginInputRef.current!.focus();
      return;
    }

    if (!emailPattern.test(login)) {
      setError("Nieprawidłowy adres e-mail.");
      loginInputRef.current!.focus();
      return;
    }

    if (!password) {
      setError("Wpisz hasło.");
      passwordInputRef.current!.focus();
      return;
    }

    if (!passwordPattern.test(password)) {
      setError(
        "Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną literę, jedną cyfrę i jeden znak specjalny (@$!%*?&)."
      );
      passwordInputRef.current!.focus();
      return;
    }

    setError(null);

    // dispatch(.....)
  };

  return (
    <>
      <StyledForm onSubmit={onFormSubmit}>
        <Input
          autoFocus
          value={login}
          name="login"
          placeholder="name@poczta.pl"
          onChange={({ target }) => setLogin(target.value)}
          ref={loginInputRef}
        />
        <Input
          value={password}
          name="password"
          placeholder="hasło"
          onChange={({ target }) => setPassword(target.value)}
          ref={passwordInputRef}
        />
        <Button>Zaloguj</Button>
      </StyledForm>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default LogForm;
