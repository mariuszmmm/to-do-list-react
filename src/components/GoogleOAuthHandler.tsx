import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const GoogleOAuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      sessionStorage.setItem("google_oauth_code", code);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/account");
    }
  }, [navigate]);

  return null;
};
