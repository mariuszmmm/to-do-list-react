import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TokenHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    if (url.includes("#confirmation_token")) {
      const token = url.split("#confirmation_token=")[1];
      sessionStorage.setItem("confirmation_token", token);
      sessionStorage.setItem("isConfirming", "true");
      navigate("/confirmation", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default TokenHandler;
