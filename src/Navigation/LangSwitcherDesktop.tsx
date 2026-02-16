import { NavButton, LangDesktop } from "./styled";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { useTranslation } from "react-i18next";

const LangSwitcherDesktop = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0];

  return (
    <LangDesktop>
      {supportedLanguages.map((lang) => (
        <NavButton onClick={() => i18n.changeLanguage(lang)} $isActive={currentLang === lang} key={lang} width='34px'>
          {lang.toUpperCase()}
        </NavButton>
      ))}
    </LangDesktop>
  );
};

export default LangSwitcherDesktop;
