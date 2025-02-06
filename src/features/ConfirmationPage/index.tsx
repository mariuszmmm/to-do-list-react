import { useEffect, useState } from "react";
import Header from "../../common/Header";
import Section from "../../common/Section";

export const ConfirmationPage = () => {
  const [userConfirmedState, setUserConfirmedState] =
    useState<string>("waiting");
  const userConfirmed = () => sessionStorage.getItem("confirmed");

  console.log(userConfirmedState);
  useEffect(() => {
    const confirmed = userConfirmed();
    setUserConfirmedState(confirmed ? confirmed : "waiting");

    const interval = setInterval(() => {
      console.log(confirmed);
      setUserConfirmedState(confirmed ? confirmed : "waiting");
      if (confirmed) clearInterval(interval);
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      setUserConfirmedState("not confirmed");
    }, 60000);

    return () => clearInterval(interval);
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
