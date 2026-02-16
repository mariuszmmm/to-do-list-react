import { NavButton, LangMobileWrapper, LangMobileLabel, LangDropdown, NavListItem } from "./styled";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { useTranslation } from "react-i18next";

const LangSwitcherMobile = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0];

  return (
    <LangMobileWrapper>
      <LangMobileLabel>{currentLang.toUpperCase()}</LangMobileLabel>
      <LangDropdown>
        {supportedLanguages.map((lang) => (
          <NavListItem key={lang}>
            <NavButton onClick={() => i18n.changeLanguage(lang)} width='34px'>
              {lang.toUpperCase()}
            </NavButton>
          </NavListItem>
        ))}
      </LangDropdown>
    </LangMobileWrapper>
  );
};

export default LangSwitcherMobile;
