import React, { useState, useContext, createContext } from "react";
import config from "../configuration";
import i18n from "../i18n";

const LanguageContext = createContext();
const LanguageSetterContext = createContext();

function useLanguage() {
  const language = useContext(LanguageContext);
  if (typeof language === undefined) {
    throw new Error(`useLanguage must be used within a LanguageProvider`);
  }
  return language;
}

function useLanguageSetter() {
  const setLanguage = useContext(LanguageSetterContext);
  if (typeof setLanguage === undefined) {
    throw new Error(`useLanguageSetter must be used within a LanguageProvider`);
  }
  return setLanguage;
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(config.i18n.defaultLocale);

  i18n.changeLanguage(language);

  return (
    <LanguageContext.Provider value={language}>
      <LanguageSetterContext.Provider value={setLanguage}>
        {children}
      </LanguageSetterContext.Provider>
    </LanguageContext.Provider>
  );
}

export { LanguageProvider, useLanguage, useLanguageSetter };
