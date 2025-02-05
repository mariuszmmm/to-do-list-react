import { auth } from "./auth";

export const tokenConfirmation = (url: string) => {
  if (url.includes("#confirmation_token")) {
    const token = url.split("#confirmation_token=")[1];
    let userConfirmed = false;

    if (token) {
      const confirmation = async () => {
        try {
          const confirmed = await auth.confirm(token);
          console.log("Confirmed:", confirmed);
          userConfirmed = true;
        } catch (error) {
          console.error("Błąd potwierdzenia konta:", error);
        }
      };

      confirmation();
    }

    if (!userConfirmed) {
      window.location.href =
        "https://to-do-list-typescript-react.netlify.app/#/confirmation?confirmation=error";
    } else {
      window.location.href =
        "https://to-do-list-typescript-react.netlify.app/#/confirmation?confirmation=success";
    }
  }
};
