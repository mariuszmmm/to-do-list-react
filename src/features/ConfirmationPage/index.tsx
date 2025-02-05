import { useEffect } from "react";
import Header from "../../common/Header";
import { useLocation, useNavigate } from "react-router-dom";

export const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searhParams = new URLSearchParams(location.search);
  const confirmation = searhParams.get("confirmation");

  useEffect(() => {
    if (confirmation !== "success" && confirmation !== "error") {
      navigate("/");
    }
  }, [confirmation, navigate]);

  return (
    <Header
      title={
        confirmation === "success" ? "Rejestacja udana" : "Rejestacja nieudana"
      }
    />
  );
};
