import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PrefsContext, UPDATE_LANGUAGE } from "../contexts/GlobalState";

import config from "../configuration";

import LanguageControls from "./LanguageControls";

export default function Header() {
  const { state, dispatch } = useContext(PrefsContext);

  const changeLanguage = lang => {
    dispatch({ type: UPDATE_LANGUAGE, language: lang });
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
        currentLocale={state.locale}
        changeLanguage={changeLanguage}
      />
    </header>
  );
}
