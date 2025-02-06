import { auth } from "./auth";

export const tokenConfirmation = (url: string) => {
  if (url.includes("#confirmation_token")) {
    const token = url.split("#confirmation_token=")[1];

    if (token) {
      const confirmation = async () => {
        try {
          const confirmed = await auth.confirm(token);
          console.log("Confirmed:", confirmed);
          sessionStorage.setItem("confirmed", confirmed.email);
        } catch (error) {
          console.error("Błąd potwierdzenia konta:", error);
        }
      };

      confirmation();
    }
    window.location.href =
      "https://to-do-list-typescript-react.netlify.app/#/confirmation";
  }
};
