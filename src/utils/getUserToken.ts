import { auth } from "../api/auth";

export const getUserToken = async () => {
  const user = auth.currentUser();

  if (!user || !user.token) {
    return null;
  }

  const expires_at = user.token.expires_at;
  const isTokenExpired = new Date().getTime() > expires_at - 60000;

  const refreshToken = async () => {
    try {
      const user = auth.currentUser();
      if (!user) {
        throw new Error("No user found");
      }
      const token = await user.jwt();
      return token;
    } catch (error) {
      console.error("Error renewing token", error);
      return null;
    }
  };

  if (isTokenExpired) {
    return await refreshToken();
  } else {
    return user.token.access_token;
  }
};
