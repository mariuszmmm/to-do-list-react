import { UserData } from "../../../types";

export const useFetch = () => {
  const getUserDataApi = async (token: string) => {
    return fetch("/lists", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(({ userData }: { userData: UserData }) => userData)
      .catch((error) => {
        console.error("Błąd pobierania danych", error);
        return null;
      });
  };
  const userConfirmation = async (email: string) => {
    return fetch(`/userConfirmation?email=${email}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Błąd pobierania danych", error);
        return null;
      });
  };

  return { getUserDataApi, userConfirmation };
};
