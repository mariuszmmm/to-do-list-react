import { useEffect, useState } from "react";
import Header from "../../common/Header";
import { useNavigate } from "react-router-dom";

export const ConfirmationPage = () => {
  const [userConfirmed, setUserConfirmed] = useState(
    sessionStorage.getItem("confirmed")
  );
  const navigate = useNavigate();

  useEffect(() => {
    setUserConfirmed(sessionStorage.getItem("confirmed"));
    console.log("userConfirmed:", userConfirmed);

    if (!userConfirmed) {
      navigate("/");
    }
  }, [userConfirmed, navigate]);

  return (
    <Header
      title={userConfirmed ? "Rejestacja udana" : "Rejestacja nieudana"}
    />
  );
};
