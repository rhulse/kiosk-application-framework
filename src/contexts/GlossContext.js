import React, { createContext, useReducer, useContext } from "react";
import Gloss from "../components/Gloss";

const initialState = null;

const GlossContext = createContext();
const GlossReducerContext = createContext();

function useGloss() {
  const gloss = useContext(GlossContext);
  if (typeof gloss === undefined) {
    throw new Error(`useGloss must be used within a GlossProvider`);
  }
  return gloss;
}

function useGlossSetter() {
  const glossSetter = useContext(GlossReducerContext);
  if (typeof glossSetter === undefined) {
    throw new Error(`useGlossSetter must be used within a GlossProvider`);
  }
  return glossSetter;
}

const glossReducer = (state, gloss) => {
  if (gloss instanceof Gloss) {
    return gloss;
  } else {
    return state;
  }
};

const GlossProvider = props => {
  const [gloss, setGloss] = useReducer(glossReducer, initialState);

  return (
    <GlossContext.Provider value={gloss}>
      <GlossReducerContext.Provider value={setGloss}>
        {props.children}
      </GlossReducerContext.Provider>
    </GlossContext.Provider>
  );
};

export { GlossProvider, useGloss, useGlossSetter };
