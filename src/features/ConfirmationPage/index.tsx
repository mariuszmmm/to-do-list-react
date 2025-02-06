import { useEffect, useState } from "react";
import Header from "../../common/Header";
import Section from "../../common/Section";
import { auth } from "../../utils/auth";

export const ConfirmationPage = () => {
  const [userConfirmedState, setUserConfirmedState] =
    useState<string>("waiting");
  const confirmationToken = () => sessionStorage.getItem("confirmation_token");

  const confirmation = async () => {
    // czekaj 3 sekundy
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const token = confirmationToken();
    console.log("Token:", token);

    try {
      if (!token) throw new Error("Brak tokenu potwierdzającego");
      const confirmed = await auth.confirm(token);
      console.log("Confirmed:", confirmed);
      setUserConfirmedState("confirmed");
    } catch (error) {
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
            ? "Rejestracja w toku, proszę czekać"
            : userConfirmedState === "confirmed"
            ? "Rejestacja udana, możesz się zalogować"
            : "Rejestacja nieudana, spróbuj ponownie"
        }
        body={null}
      />
    </>
  );
};
