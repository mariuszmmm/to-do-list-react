import langDe from "./locales/de";
import langEn from "./locales/en";
import langPl from "./locales/pl";

export const resources = {
  pl: { translation: langPl },
  en: { translation: langEn },
  de: { translation: langDe },
};

export type SupportedLanguages = keyof typeof resources;
export const supportedLanguages = Object.keys(
  resources
) as SupportedLanguages[];
export const defaultLanguage = "pl" as SupportedLanguages;
