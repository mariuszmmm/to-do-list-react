import { useEffect, useState } from "react";
import Header from "../../common/Header";
import Section from "../../common/Section";
import { auth } from "../../utils/auth";
import ConfirmationButtons from "./ConfirmationButtons";

export const ConfirmationPage = () => {
  const [userConfirmedState, setUserConfirmedState] =
    useState<string>("waiting");
  const confirmationToken = () => sessionStorage.getItem("confirmation_token");

  const confirmation = async () => {
    const token = confirmationToken();
    console.log("Token:", token);

    try {
      if (!token) {
        setUserConfirmedState("token_error");
        return;
      }
      const confirmed = await auth.confirm(token);
      console.log("Confirmed:", confirmed);
      setUserConfirmedState("confirmed");
    } catch (error: any) {
      console.log(error.message);
      setUserConfirmedState("error");
      console.error("Błąd potwierdzenia konta:", error);
    }
  };

  useEffect(() => {
    confirmation();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header title="Potwierdzenie rejestracji" />
      <Section
        title={
          userConfirmedState === "waiting"
            ? "Sprawdzam stan rejestracji..."
            : userConfirmedState === "confirmed"
            ? "Rejestracja udana, możesz się zalogować"
            : userConfirmedState === "token_error"
            ? "Link nieprawidłowy"
            : "Link wygasł lub został już użyty"
        }
        extraHeaderContent={
          userConfirmedState === "confirmed" && <ConfirmationButtons />
        }
        body={null}
      />
    </>
  );
};
