import langDe from "./locales/de";
import langEn from "./locales/en";
import langPl from "./locales/pl";

export const resources = {
  pl: { translation: langPl },
  en: { translation: langEn },
  de: { translation: langDe },
};

export const langCodes: Record<SupportedLanguages, string> = {
  pl: "pl-Pl",
  en: "en-US",
  de: "de-DE",
};

export type SupportedLanguages = keyof typeof resources;
export const supportedLanguages = Object.keys(
  resources
) as SupportedLanguages[];
export const defaultLanguage = "pl" as SupportedLanguages;
