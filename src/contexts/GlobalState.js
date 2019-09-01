import React, { createContext, useReducer } from "react";
import config from "../configuration";
import i18n from "../i18n";

export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";

const initialState = {
  locale: config.i18n.defaultLocale
};

export const PrefsContext = createContext();

const prefsReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      i18n.changeLanguage(action.language);
      return { ...state, locale: action.language };

    default:
      break;
  }
  return state;
};

const GlobalState = props => {
  const [state, dispatch] = useReducer(prefsReducer, initialState);

  return (
    <PrefsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </PrefsContext.Provider>
  );
};

export default GlobalState;
