import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { resources, defaultLanguage } from "./languageResources";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    interpolation: { escapeValue: false },
  });

export default i18n;
