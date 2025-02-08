import { useEffect, useState } from "react";
import Header from "../../common/Header";
import Section from "../../common/Section";
import { auth } from "../../utils/auth";
import ConfirmationButtons from "./ConfirmationButtons";
import { useDispatch, useSelector } from "react-redux";
import { selectIsConfirmation, setIsConfirmation } from "./confirmationSlice";

export const ConfirmationPage = () => {
  const [userConfirmedState, setUserConfirmedState] =
    useState<string>("waiting");
  const [leftTime, setLeftTime] = useState<number>(20);
  const dispatch = useDispatch();
  const isConfirmation = useSelector(selectIsConfirmation);

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
    if (userConfirmedState === "confirmed") {
      const interval = setInterval(() => {
        setLeftTime((prev) => prev - 1);
        if (leftTime === 0) {
          window.close();
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line
  }, [userConfirmedState]);

  useEffect(() => {
    dispatch(setIsConfirmation());
    console.log("isConfirmation", isConfirmation);
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
          userConfirmedState === "confirmed" && (
            <ConfirmationButtons leftTime={leftTime} />
          )
        }
        body={null}
      />
    </>
  );
};
