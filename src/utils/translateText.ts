export const translateText = async (text: string, targetLanguage: string) => {
  return await fetch("/translateMessage", {
    method: "POST",
    body: JSON.stringify({ text, targetLanguage }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => data.translatedText || null)
    .catch((error) => {
      console.error("Error fetching translation", error);
    });
};
