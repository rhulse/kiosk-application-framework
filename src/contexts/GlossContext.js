import React, { createContext, useReducer, useMemo, useContext } from "react";
import Gloss from "../components/Gloss";

const initialState = null;

export const GlossContext = createContext();

function useGloss() {
  const context = useContext(GlossContext);

  if (!context) {
    throw new Error(`useGloss must be used within a GlossProvider`);
  }

  return context;
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
  const value = useMemo(() => [gloss, setGloss], [gloss]);

  return (
    <GlossContext.Provider value={value}>
      {props.children}
    </GlossContext.Provider>
  );
};

export { GlossProvider, useGloss };
