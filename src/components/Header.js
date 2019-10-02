import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

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
      <Link className="btn btn-secondary mr-4" to="/">
        <FontAwesomeIcon icon={faHome} size="1x" /> Home
      </Link>
      <Link className="btn mr-2" to="/page-one">
        Page One
      </Link>
      <Link className="btn mr-2" to="/page-two">
        Page Two
      </Link>
      <Link className="btn" to="/page-three">
        Page Three
      </Link>
      <LanguageControls
        locales={config.i18n.locales}
        currentLocale={language}
        changeLanguage={changeLanguage}
      />
    </header>
  );
}
