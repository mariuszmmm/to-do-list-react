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

    try {
      if (!token) throw new Error("Brak tokenu potwierdzającego");
      await auth.confirm(token);
      setUserConfirmedState("confirmed");
    } catch (error: any) {
      setUserConfirmedState("error");
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
            ? "Rejestracja udana, zamknij stronę"
            : "Link wygasł lub został użyty"
        }
        extraHeaderContent={
          userConfirmedState === "confirmed" && <ConfirmationButtons />
        }
        body={null}
      />
    </>
  );
};
