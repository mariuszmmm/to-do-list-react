export const confirmUserApi = async (email: string) => {
  return fetch(`/confirmUser?email=${email}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error("Błąd pobierania danych", error);
    });
};

export const deleteUserApi = async (token: string) => {
  return fetch("/deleteUser", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
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
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Błąd resetowania hasła", error);
    });
};
