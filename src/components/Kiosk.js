import React, { useRef, useContext, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";

import { useAnalytics } from "../analytics/Analytics";

import { PrefsContext, SET_GLOSS, SET_LANGUAGE } from "../contexts/GlobalState";

import IdleTimer from "react-idle-timer";
import ScreenSaver from "./ScreenSaver";
import config from "../configuration";

import Header from "./Header";
import Main from "./Main";
import Gloss from "./Gloss";

const listenForRouteChanges = (analytics, history) => {
  return history.listen((location, action) => {
    if (location.state !== "reset") {
      // we do not register an automatic return to the home page.
      analytics.pageView(location.pathname);
    }
    // location is an object like window.location
    // console.log(action, location.pathname, location.state);
  });
};

const hideOpenGloss = glossRef => {
  glossRef.current.hide();
};

const returnToHome = props => {
  props.history.push("/", "reset");
};

const setLanguageToDefault = dispatch => {
  dispatch({ type: SET_LANGUAGE, language: config.i18n.defaultLocale });
};

function Kiosk(props) {
  const glossRef = useRef(null);
  const idleTimer = useRef(null);
  const screenSaver = useRef(null);
  const { dispatch } = useContext(PrefsContext);
  const analytics = useAnalytics();

  const appIsActive = useCallback(() => {
    screenSaver.current.stop();
  }, []);

  // props.test = "frog";

  const appIsIdle = useCallback(() => {
    // TODO: Add session end
    hideOpenGloss(glossRef);
    returnToHome(props);
    setLanguageToDefault(dispatch);
    screenSaver.current.start();
  }, [props, dispatch]);

  useEffect(() => {
    /* 
      NB: This causes a second render at startup when the gloss reference is set.
      See gloss module for more information on why this is needed
    */
    dispatch({ type: SET_GLOSS, gloss: glossRef.current });
  }, [dispatch]);

  useEffect(() => {
    // start watching for route changes AFTER the above startup regime
    // we don't want the first page render to register on startup as this
    // can throw off page view stats
    const unlisten = listenForRouteChanges(analytics, props.history);

    return unlisten;
    // ignore linting rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
