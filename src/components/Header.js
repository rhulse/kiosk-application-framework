import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAnalytics } from "../analytics/Analytics";

import config from "../configuration";

import LanguageControls from "./LanguageControls";

export default function Header() {
  const [language, setLanguage] = useLanguage();
  const analytics = useAnalytics();

  const changeLanguage = language => {
    analytics.setLanguage(language);
    setLanguage(language);
  };

  return (
    <header className="m-4">
      <Link className="btn btn-secondary mr-2" to="/">
        Home
      </Link>
      <Link className="btn btn-secondary" to="/page-two">
        Page Two
      </Link>
      <LanguageControls
        locales={config.i18n.locales}
        currentLocale={language}
        changeLanguage={changeLanguage}
      />
    </header>
  );
}
