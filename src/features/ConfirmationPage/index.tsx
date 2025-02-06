import { useEffect, useState } from "react";
import Header from "../../common/Header";
import Section from "../../common/Section";

const userConfirmed = sessionStorage.getItem("confirmed");

export const ConfirmationPage = () => {
  const [userConfirmedState, setUserConfirmedState] = useState<string>(
    userConfirmed ? userConfirmed : "waiting"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const userConfirmed = sessionStorage.getItem("confirmed");

      setUserConfirmedState(userConfirmed === null ? "waiting" : "confirmed");
      if (userConfirmed) clearInterval(interval);
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
