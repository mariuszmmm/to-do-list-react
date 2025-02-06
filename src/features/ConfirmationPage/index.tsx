import { useEffect, useState } from "react";
import Header from "../../common/Header";
import Section from "../../common/Section";

export const ConfirmationPage = () => {
  const [userConfirmedState, setUserConfirmedState] =
    useState<string>("waiting");

  console.log("userConfirmedState:", userConfirmedState);

  useEffect(() => {
    console.log("userConfirmedState:", userConfirmedState);

    const interval = setInterval(() => {
      const userConfirmed = sessionStorage.getItem("confirmed");
      console.log("userConfirmed:", userConfirmed);

      setUserConfirmedState(userConfirmed === null ? "waiting" : "confirmed");

      console.log(userConfirmed);
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      setUserConfirmedState("not confirmed");
      console.log("clearInterval");
    }, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header
        title={
          userConfirmedState === "waiting"
            ? "Rejestracja w toku, proszę czekać"
            : userConfirmedState === "confirmed"
            ? "Rejestacja udana"
            : "Rejestacja nieudana"
        }
      />
      {userConfirmedState !== "waiting" && (
        <Section
          title={
            userConfirmedState === "confirmed"
              ? "Możesz się zalogować"
              : "Ponów próbę rejestracji"
          }
          body={null}
        />
      )}
    </>
  );
};
