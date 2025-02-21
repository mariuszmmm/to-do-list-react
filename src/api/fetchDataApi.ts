import { Data, List, Version } from "../types";

export const getDataApi = async (token: string) => {
  return fetch("/getData", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(({ data }: { data: Data }) => data)
    .catch((error) => {
      console.error("Błąd pobierania danych", error);
    });
};

export const addDataApi = async (
  token: string,
  version: Version,
  list: List
) => {
  return fetch("/updateData", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ version, list }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 409) {
          return { version: null };
        } else throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Błąd aktualizacji danych", error.message);
      if (error.message === "Conflict") {
        return { version: null };
      }
    });
};

export const removeDataApi = async (
  token: string,
  version: Version,
  listId: string
) => {
  return fetch("/updateData", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ version, listId }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 409) {
          return { version: null };
        } else throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Błąd aktualizacji danych", error.message);
    });
};
