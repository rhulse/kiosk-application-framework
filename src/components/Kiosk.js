import React, { useRef, useContext, useEffect, useCallback } from "react";
import { PrefsContext, SET_GLOSS, SET_LANGUAGE } from "../contexts/GlobalState";
import { withRouter } from "react-router-dom";

import IdleTimer from "react-idle-timer";
import ScreenSaver from "./ScreenSaver";
import config from "../configuration";

import Header from "./Header";
import Main from "./Main";
import Gloss from "./Gloss";

const hideOpenGloss = glossRef => {
  glossRef.current.hide();
};

const returnToHome = props => {
  props.history.push("/");
};

const setLanguageToDefault = dispatch => {
  dispatch({ type: SET_LANGUAGE, language: config.i18n.defaultLocale });
};

function Kiosk(props) {
  const glossRef = useRef(null);
  const idleTimer = useRef(null);
  const screenSaver = useRef(null);
  const { dispatch } = useContext(PrefsContext);

  const appIsActive = useCallback(() => {
    screenSaver.current.stop();
  }, []);

  const appIsIdle = useCallback(() => {
    // TODO: Add session end
    hideOpenGloss(glossRef);
    returnToHome(props);
    setLanguageToDefault(dispatch);
    screenSaver.current.start();
  }, []);

  useEffect(() => {
    dispatch({ type: SET_GLOSS, gloss: glossRef.current });
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
        <Header />
        <Main />
        <Gloss ref={glossRef} />
      </div>
    </>
  );
}

export default withRouter(Kiosk);
