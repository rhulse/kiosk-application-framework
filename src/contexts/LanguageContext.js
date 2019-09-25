import React, { useState, useContext, useMemo, createContext } from "react";
import config from "../configuration";
import i18n from "../i18n";

const LanguageContext = createContext();

function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(`useLanguage must be used within a LanguageProvider`);
  }

  return context;
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(config.i18n.defaultLocale);
  const value = useMemo(() => [language, setLanguage], [language]);

  i18n.changeLanguage(language);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageProvider, useLanguage };
