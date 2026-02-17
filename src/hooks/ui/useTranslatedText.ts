import { useEffect, useState } from "react";
import { translateText } from "../../api/translateTextApi";
import i18n from "../../utils/i18n";

/**
 * Hook do tłumaczenia dowolnego tekstu na aktualny język aplikacji.
 * @param text Tekst do przetłumaczenia (może być null/undefined)
 * @returns Przetłumaczony tekst lub null jeśli brak wejścia
 */
export function useTranslatedText(text?: string | null): string | null {
  const [translated, setTranslated] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const translate = async () => {
      if (text) {
        const result = await translateText(text, i18n.language);
        if (isMounted) setTranslated(result);
      } else {
        setTranslated(null);
      }
    };
    translate();
    return () => {
      isMounted = false;
    };
  }, [text]);

  return translated;
}
