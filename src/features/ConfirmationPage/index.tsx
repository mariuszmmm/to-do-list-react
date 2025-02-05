import { useEffect } from "react";
import Header from "../../common/Header";
import { useNavigate } from "react-router-dom";

export const ConfirmationPage = () => {
  const navigate = useNavigate();
  const confirmed = sessionStorage.getItem("confirmed");

  console.log("confirmed:", confirmed);

  useEffect(() => {
    if (!confirmed) {
      navigate("/");
      console.log("Nie potwierdzono konta");
    }
  }, [confirmed, navigate]);

  return (
    <Header title={confirmed ? "Rejestacja udana" : "Rejestacja nieudana"} />
  );
};
