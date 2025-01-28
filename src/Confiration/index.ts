import { useEffect } from "react";
import { getUrlFromLocalStorage } from "../utils/localStorage";

export const Confiration = () => {
  useEffect(() => {
    const urlCurrent = window.location.href;
    const url = getUrlFromLocalStorage();
    console.log("url", url);
    console.log("urlCurrent", urlCurrent);

    if (url && url.includes("#confirmation_token")) {
      const token = url.split("#confirmation_token=")[1];
      console.log("Confiration token", token);
    }
  }, []);

  return null;
};
