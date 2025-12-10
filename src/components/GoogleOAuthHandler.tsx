import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const GoogleOAuthHandler = ({ userEmail }: { userEmail: string | null }) => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("[OAuth] window.location.search:", window.location.search);
    console.log("[OAuth] window.location.pathname:", window.location.pathname);
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("[OAuth] code:", code);
    if (code) {
      sessionStorage.setItem("google_oauth_code", code);
      console.log("[OAuth] Setting code in sessionStorage and navigating to /account (hash)");
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("TEST", window.location, window.location.hash, window.location.pathname);
      // window.location.hash = "#/account";

      navigate("/account");
      console.log("[OAuth] Navigation to /account done.");
    }
  }, [userEmail]);

  return null;
};
