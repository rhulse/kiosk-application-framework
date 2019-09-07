import React, { useRef, useContext, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { PrefsContext, ADD_GLOSS } from "../contexts/GlobalState";

import IdleTimer from "react-idle-timer";
import ScreenSaver from "./ScreenSaver";
import config from "../configuration";

import Header from "./Header";
import Main from "./Main";
import Gloss from "./Gloss";

export default function Kiosk() {
  const glossRef = useRef(null);
  const idleTimer = useRef(null);
  const screenSaver = useRef(null);

  const { dispatch } = useContext(PrefsContext);

  const appIsActive = useCallback(() => {
    screenSaver.current.stop();
  }, []);

  const appIsIdle = useCallback(() => {
    glossRef.current.hide();
    screenSaver.current.start();
  }, []);

  useEffect(() => {
    dispatch({ type: ADD_GLOSS, gloss: glossRef.current });
  }, [dispatch]);

  return (
    <>
      <ScreenSaver ref={screenSaver} />
      <IdleTimer
        ref={idleTimer}
        onActive={appIsActive}
        onIdle={appIsIdle}
        debounce={250}
        timeout={config.screensaver.seconds_timeout_to_start}
        startOnLoad
      />
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
