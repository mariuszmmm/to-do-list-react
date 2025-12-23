import langPl from "./locales/pl";
import langEn from "./locales/en";
import langDe from "./locales/de";

export const resources = {
  pl: { translation: langPl },
  en: { translation: langEn },
  de: { translation: langDe },
};

export const langCodes: Record<SupportedLanguages, string> = {
  pl: "pl",
  en: "en",
  de: "de",
};

export type SupportedLanguages = keyof typeof resources;
export const supportedLanguages = Object.keys(
  resources
) as SupportedLanguages[];
export const defaultLanguage = "pl" as SupportedLanguages;

export type TranslationSchema = typeof langPl;
