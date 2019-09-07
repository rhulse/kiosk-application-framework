import React, { createContext, useReducer } from "react";
import config from "../configuration";
import i18n from "../i18n";

export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_GLOSS = "SET_GLOSS";

const initialState = {
  locale: config.i18n.defaultLocale,
  gloss: null
};

export const PrefsContext = createContext();

const prefsReducer = (state, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      i18n.changeLanguage(action.language);
      return { ...state, locale: action.language };

    case SET_GLOSS:
      return { ...state, gloss: action.gloss };

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
