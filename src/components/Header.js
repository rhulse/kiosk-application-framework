import React from "react";
import { Link } from "react-router-dom";

import Icon, { home } from "./Icon";

import config from "../configuration";
import { useLanguage } from "../contexts/LanguageContext";
import { useAnalytics } from "../analytics/Analytics";
import { translateText } from "./TranslatedRichText";

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
        <Icon icon={home} size="1x" /> {translateText("labels.home")}
      </Link>
      <Link className="btn mr-2" to="/page-one">
        {translateText("labels.pageOne")}
      </Link>
      <Link className="btn mr-2" to="/page-two">
        {translateText("labels.pageTwo")}
      </Link>
      <Link className="btn" to="/page-three">
        {translateText("labels.pageThree")}
      </Link>
      <Link className="btn" to="/video-page">
        {translateText("labels.videoPage")}
      </Link>
      <LanguageControls
        locales={config.i18n.locales}
        currentLocale={language}
        changeLanguage={changeLanguage}
      />
    </header>
  );
}
