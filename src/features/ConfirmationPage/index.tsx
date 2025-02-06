import { useEffect, useState } from "react";
import Header from "../../common/Header";
import { useNavigate } from "react-router-dom";

export const ConfirmationPage = () => {
  const [userConfirmed, setUserConfirmed] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log("userConfirmed:", userConfirmed);

  useEffect(() => {
    console.log("userConfirmed:", userConfirmed);

    const interval = setInterval(() => {
      const userConfirmed = sessionStorage.getItem("confirmed");

      setUserConfirmed(userConfirmed);

      //  tu skączyłem

      console.log(userConfirmed);
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      console.log("clearInterval");
    }, 60000);

    return () => clearInterval(interval);

    // if (!userConfirmed) {
    //   navigate("/");
    // }
  }, [userConfirmed, navigate]);

  return (
    <Header
      title={userConfirmed ? "Rejestacja udana" : "Rejestacja nieudana"}
    />
  );
};
