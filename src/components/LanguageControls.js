import React from "react";

import "./../i18n";
import { useTranslation } from "react-i18next";

export default function LanguageControls(props) {
  const { i18n } = useTranslation();

  const locales = props.locales;

  if (locales === undefined) {
    return "Locale prop for LanguageControls not set";
  }

  return (
    <div className="language-controls">
      {locales.map((locale, key) => {
        return (
          <button
            key={key}
            className="btn btn-primary"
            onClick={() => i18n.changeLanguage(locale.code)}
          >
            {locale.name}
          </button>
        );
      })}
    </div>
  );
}
