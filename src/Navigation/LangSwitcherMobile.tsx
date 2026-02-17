import React, { useState, useEffect, useRef } from "react";
import { NavButton, LangMobileWrapper, LangDropdown, NavListItem } from "./styled";
import { supportedLanguages } from "../utils/i18n/languageResources";
import { useTranslation } from "react-i18next";

export const LangSwitcherMobile = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0];
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef(false);

  const handleLabelClick = (e?: React.MouseEvent) => {
    if (touchRef.current) {
      touchRef.current = false;
      return;
    }
    setIsOpen((open) => !open);
  };
  const handleLabelMouseEnter = () => setIsOpen(true);
  const handleLabelTouchEnd = (e: React.TouchEvent) => {
    touchRef.current = true;
    setIsOpen((open) => !open);
  };
  const handleItemClick = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => {
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <LangMobileWrapper ref={wrapperRef}>
      <NavButton
        $isActive
        onClick={handleLabelClick}
        onMouseEnter={handleLabelMouseEnter}
        onTouchEnd={handleLabelTouchEnd}
      >
        {currentLang.toUpperCase()}
      </NavButton>
      <LangDropdown $isOpen={isOpen}>
        {supportedLanguages.map((lang) => (
          <NavListItem key={lang}>
            <NavButton onClick={() => handleItemClick(lang)}>{lang.toUpperCase()}</NavButton>
          </NavListItem>
        ))}
      </LangDropdown>
    </LangMobileWrapper>
  );
};
