import React, { createContext, useReducer, useContext } from "react";

import glossData from "../content/glossData";

export const defaultGlossInformation = {
  show: false,
  callingEvent: null,
  word: "Unknown Word",
  description: "No desciption",
  language: "No Lang",
  partOfSpeech: "No Part",
  audioFile: ""
};

const getWordInformation = element => {
  const contentKey = element.getAttribute("data-gloss");

  const info = glossData[contentKey] || defaultGlossInformation;

  return {
    clickedWord: element.innerHTML,
    word: info.word,
    description: info.description,
    language: info.language,
    partOfSpeech: info.partOfSpeech,
    audioFile: info.audioFile
  };
};

const GlossContext = createContext(defaultGlossInformation);
const GlossReducerContext = createContext();

function useGloss() {
  const gloss = useContext(GlossContext);
  if (typeof gloss === undefined) {
    throw new Error(`useGloss must be used within a GlossProvider`);
  }
  return gloss;
}

function useGlossDispatcher() {
  const glossDispatcher = useContext(GlossReducerContext);
  if (typeof glossDispatcher === undefined) {
    throw new Error(`useGlossDispatcher must be used within a GlossProvider`);
  }
  return glossDispatcher;
}

const glossReducer = (state, action) => {
  switch (action.action) {
    case "show":
      const glossedElement = action.callingEvent.target;
      return {
        ...state,
        show: true,
        callingEvent: action.callingEvent,
        ...getWordInformation(glossedElement)
      };

    case "hide":
      return { ...defaultGlossInformation };

    default:
      return state;
  }
};

const GlossProvider = props => {
  const [gloss, glossDispatcher] = useReducer(
    glossReducer,
    defaultGlossInformation
  );
  return (
    <GlossContext.Provider value={gloss}>
      <GlossReducerContext.Provider value={glossDispatcher}>
        {props.children}
      </GlossReducerContext.Provider>
    </GlossContext.Provider>
  );
};

export { GlossProvider, useGloss, useGlossDispatcher };
