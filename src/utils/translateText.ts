export const translateText = async (text: string, targetLanguage: string) => {
  try {
    const response = await fetch("/translate-translateMessage", {
      method: "POST",
      body: JSON.stringify({ text, targetLanguage }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.translatedText || null;
  } catch (error) {
    console.error("Error fetching translation", error);
    throw error;
  }
};
