import { List, Version } from "../types";

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
    .then(({ data }) => data)
    .catch((error) => {
      console.error("Error fetching data", error);
    });
};

export const addDataApi = async (
  token: string,
  list: List,
  deviceId: string
) => {
  return fetch("/addData", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ list, deviceId }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 409) {
          return response.json();
        } else throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error updating data", error.message);
    });
};

export const removeDataApi = async (
  token: string,
  version: Version,
  listId: string,
  deviceId: string
) => {
  return fetch("/removeData", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ version, listId, deviceId }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 409) {
          return response.json();
        } else throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error updating data", error.message);
    });
};

export const updateDataApi = async (
  token: string,
  lists: List[],
  deviceId: string
) => {
  return fetch("/updateData", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ lists, deviceId }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 409) {
          return response.json();
        } else throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error updating data", error.message);
    });
};
