import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import langPl from "./locales/pl";
import langEn from "./locales/en";
import langDe from "./locales/de";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        translation: langPl,
      },
      en: {
        translation: langEn,
      },
      de: {
        translation: langDe,
      },
    },
    fallbackLng: "pl",
    interpolation: { escapeValue: false },
  });

export default i18n;
