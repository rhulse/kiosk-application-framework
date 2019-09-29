import React from "react";
import { Link } from "react-router-dom";

import config from "../configuration";
import { useLanguage } from "../contexts/LanguageContext";
import { useAnalytics } from "../analytics/Analytics";

import LanguageControls from "./LanguageControls";

export default function Header() {
  const [language, setLanguage] = useLanguage();
  const analytics = useAnalytics();

  const changeLanguage = language => {
    analytics.setLanguage(language);
    setLanguage(language);
  };

  return (
    <header>
      <Link className="btn btn-secondary mr-2" to="/">
        Home
      </Link>
      <Link className="btn btn-secondary mr-2" to="/page-two">
        Page Two
      </Link>
      <Link className="btn btn-secondary mr-2" to="/page-three">
        Page Three
      </Link>
      <Link className="btn btn-secondary" to="/page-four">
        Page Four
      </Link>
      <LanguageControls
        locales={config.i18n.locales}
        currentLocale={language}
        changeLanguage={changeLanguage}
      />
    </header>
  );
}
