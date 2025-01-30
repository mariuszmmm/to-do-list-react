import { auth } from "../features/Account/auth";
import {
  saveTokenInLocalStorage,
  saveUserConfirmedInLocalStorage,
} from "./localStorage";

export const getToken = (url: string) => {
  if (url.includes("#confirmation_token")) {
    const token = url.split("#confirmation_token=")[1];
    saveTokenInLocalStorage(token);

    if (token) {
      const confirmation = async () => {
        try {
          const confirmed = await auth.confirm(token);
          console.log("Confirmed:", confirmed);

          if (confirmed) {
            console.log("logowanie");
            saveUserConfirmedInLocalStorage(true);
            // login();
          }
        } catch (error) {
          console.error("Błąd potwierdzenia konta:", error);
        }

        // clearTokenFromLocalStorage();
      };

      confirmation();
    }
    window.location.href =
      "https://to-do-list-typescript-react.netlify.app/#/autor";
    // window.location.href = "http://localhost:8888/#/konto";
    console.log("token zapisany", token);
  }
};
