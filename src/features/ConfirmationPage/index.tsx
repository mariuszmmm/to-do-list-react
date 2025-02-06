import { useEffect, useState } from "react";
import Header from "../../common/Header";
import Section from "../../common/Section";

const userConfirmed = () => sessionStorage.getItem("confirmed");

export const ConfirmationPage = () => {
  const [userConfirmedState, setUserConfirmedState] = useState<string>(
    userConfirmed() ? "confirmed" : "waiting"
  );

  console.log(userConfirmedState);
  useEffect(() => {
    const interval = setInterval(() => {
      const confirmed = userConfirmed();

      console.log(confirmed);

      if (confirmed) {
        setUserConfirmedState("confirmed");
        clearInterval(interval);
        clearTimeout(timeout);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setUserConfirmedState("not confirmed");
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
