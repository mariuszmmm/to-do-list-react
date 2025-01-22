import { Data, List } from "../types";

// Wprowadzić poprawki  //

export const getDataApi = async (token: string) => {
  return fetch("/getData", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then(({ data }: { data: Data }) => data)
    .catch((error) => {
      console.error("Błąd pobierania danych", error);
      return null;
    });
};

export const addDataApi = async (token: string, data: List) => {
  return fetch("/updateData", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Błąd aktualizacji danych", error.message);
    });
};

export const removeDataApi = async (token: string, id: string) => {
  return fetch("/updateData", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Błąd aktualizacji danych", error);
      return null;
    });
};

export const confirmUserApi = async (email: string) => {
  return fetch(`/confirmUser?email=${email}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Błąd pobierania danych", error);
      return null;
    });
};

export const deleteUserApi = async (token: string) => {
  return fetch("/deleteUser", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      console.log("/deleteUser response", response);
      if (!response.ok) {
        throw new Error(`Błąd usuwania użytkownika: ${response.statusText}`);
      }

      return {
        statusCode: response.status,
        message: `Usunięto użytkownika!`,
      };
    })
    .catch((error) => {
      console.error("Błąd:", error);
      return {
        statusCode: 500,
        message: `Internal Server Error: ${error.message}`,
      };
    });
};

export const resetPasswordApi = async (token: string) => {
  return fetch("/resetPassword", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Błąd pobierania danych", error);
      return null;
    });
};
