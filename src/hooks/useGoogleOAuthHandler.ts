import { useEffect } from "react";

export const useGoogleOAuthHandler = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      sessionStorage.setItem("google_oauth_code", code);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.hash = "#/account";
    }
  }, []);
};
