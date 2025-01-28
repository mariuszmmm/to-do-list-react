import { useEffect } from "react";
import { getTokenFromLocalStorage } from "../utils/localStorage";

export const Confiration = () => {
  useEffect(() => {
    const urlCurrent = window.location.href;
    const token = getTokenFromLocalStorage();
    console.log("urlCurrent", urlCurrent);
    console.log("token from local storage", token);
  }, []);

  return null;
};
