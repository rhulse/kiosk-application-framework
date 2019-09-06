import React, { useRef, useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { PrefsContext, ADD_GLOSS } from "../contexts/GlobalState";

import Header from "./Header";
import Main from "./Main";
import Gloss from "./Gloss";

export default function Kiosk() {
  const glossRef = useRef(null);
  const { dispatch } = useContext(PrefsContext);

  useEffect(() => {
    dispatch({ type: ADD_GLOSS, gloss: glossRef.current });
  }, [dispatch]);

  return (
    <>
      <div className="container">
        <BrowserRouter>
          <Header />
          <Main />
        </BrowserRouter>
        <Gloss ref={glossRef} />
      </div>
    </>
  );
}
