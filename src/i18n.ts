import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translation_en, translation_pl } from "./utils/translation";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translation_en },
    pl: { translation: translation_pl },
  },
  lng: "pl",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
