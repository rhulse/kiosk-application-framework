import React from "react";

export default function LanguageControls(props) {
  const { locales, currentLocale, changeLanguage } = props;

  if (locales === undefined) {
    return "Locales prop for LanguageControls not set";
  }

  return (
    <div className="language-controls">
      {locales.map((locale, key) => {
        let className = "btn ";
        className =
          className +
          (currentLocale === locale.code
            ? "btn-primary"
            : "btn-outline-primary");

        return (
          <button
            key={key}
            className={className}
            onClick={() => changeLanguage(locale.code)}
          >
            {locale.name}
          </button>
        );
      })}
    </div>
  );
}
