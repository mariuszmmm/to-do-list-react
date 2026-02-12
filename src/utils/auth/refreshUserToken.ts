import { auth } from "../../api/auth";

export const refreshUserToken = async () => {
  const user = auth.currentUser();

  const waitingForConfirmation = sessionStorage.getItem("waitingForConfirmation");
  if (waitingForConfirmation) {
    return null;
  }

  try {
    if (!user) {
      throw new Error("No user found");
    }
    const token = await user.jwt();

    return token;
  } catch (error: any) {
    console.error("[refreshUserToken] Błąd podczas odświeżania tokena:", error);

    if (error.status === 401 || error.message === "No user found") {
      await user?.logout();
      window.location.reload();
    }
    return null;
  }
};
