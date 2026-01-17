export const translateText = async (text: string, targetLanguage: string) => {
  if (!text) throw new Error("No text provided for translation");
  const langCode = targetLanguage.split("-")[0];
  try {
    const response = await fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, targetLanguage: langCode }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.translatedText || null;
  } catch (error) {
    console.error("Error fetching translation", error);
    return null;
  }
};
