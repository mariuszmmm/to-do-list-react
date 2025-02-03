import { UserData } from "../../../types";

export const useFetch = () => {
  const getUserDataApi = async (token: string) => {
    return fetch("/getUserData", {
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
  const setUserApi = async (email: string) => {
    return fetch(`/setUser?email=${email}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Błąd pobierania danych", error);
        return null;
      });
  };

  return { getUserDataApi, setUserApi };
};
