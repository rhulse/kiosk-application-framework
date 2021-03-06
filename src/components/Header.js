import React from "react";
import { Link } from "react-router-dom";

import Icon, { home } from "./Icon";

import config from "../configuration";
import { useLanguage, useLanguageSetter } from "../contexts/LanguageContext";
import { analytics } from "../utils/analytics";
import { translateText } from "./TranslatedRichText";

import LanguageControls from "./LanguageControls";

export default function Header() {
  const language = useLanguage();
  const setLanguage = useLanguageSetter();

  const changeLanguage = language => {
    analytics.setLanguage(language);
    setLanguage(language);
  };

  return (
    <header>
      <Link
        className="btn btn-secondary mr-4"
        to={{
          pathname: "/",
          state: { targetCarousel: "Main", action: "viaNav" }
        }}
      >
        <Icon icon={home} size="1x" /> {translateText("labels.home")}
      </Link>
      <Link
        className="btn mr-2"
        to={{
          pathname: "/page-one",
          state: { targetCarousel: "Main", action: "viaNav" }
        }}
      >
        {translateText("labels.pageOne")}
      </Link>
      <Link
        className="btn mr-2"
        to={{
          pathname: "/page-two",
          state: { targetCarousel: "Main", action: "viaNav" }
        }}
      >
        {translateText("labels.pageTwo")}
      </Link>
      <Link
        className="btn"
        to={{
          pathname: "/page-three",
          state: { targetCarousel: "Main", action: "viaNav" }
        }}
      >
        {translateText("labels.pageThree")}
      </Link>
      <Link
        className="btn"
        to={{
          pathname: "/video-page",
          state: { targetCarousel: "Main", action: "viaNav" }
        }}
      >
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
