import { auth } from "../features/Account/auth";

export const tokenConfirmation = (url: string) => {
  if (url.includes("#confirmation_token")) {
    const token = url.split("#confirmation_token=")[1];

    if (token) {
      const confirmation = async () => {
        try {
          const confirmed = await auth.confirm(token, true);
          console.log("Confirmed:", confirmed);
        } catch (error) {
          console.error("Błąd potwierdzenia konta:", error);
        }
      };

      confirmation();
    }
    window.location.href =
      "https://to-do-list-typescript-react.netlify.app/#/autor";
  }
};
