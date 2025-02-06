import { useEffect, useState } from "react";
import Header from "../../common/Header";

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
  }, [userConfirmedState]);

  return (
    <Header
      title={
        userConfirmedState === "waiting"
          ? "Czekam na potwierdzenie konta"
          : userConfirmedState === "confirmed"
          ? "Rejestacja udana"
          : "Rejestacja nieudana"
      }
    />
  );
};
