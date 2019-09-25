import React, { useRef, useEffect, useCallback } from "react";
import useRouter from "../hooks/useRouter";

import { analytics } from "../analytics/Analytics";

import { useGloss } from "../contexts/GlossContext";
import { useLanguage } from "../contexts/LanguageContext";

import IdleTimer from "react-idle-timer";
import ScreenSaver from "./ScreenSaver";
import config from "../configuration";

import Header from "./Header";
import Main from "./Main";
import Gloss from "./Gloss";

const listenForRouteChanges = (analytics, history) => {
  let previousPage = null;

  return history.listen((location, action) => {
    // if someone clicks on the same link again, we do nothing.
    if (previousPage === location.pathname) {
      return;
    }

    previousPage = location.pathname;

    // if this is a reset (the app is idle), we don't do a pageview either
    if (location.state === "reset") {
      return;
    }

    analytics.pageView(location.pathname);
  });
};

function Kiosk(props) {
  const glossRef = useRef(null);
  const idleTimer = useRef(null);
  const screenSaver = useRef(null);

  const [, setLanguage] = useLanguage();

  const [, setGloss] = useGloss();

  const { history: browserHistory } = useRouter();

  const appIsActive = useCallback(() => {
    config.logging.idleState && console.log("[APPLICATION] Active");

    screenSaver.current.stop();
    /* 
      If the screen saver is an 'attractor loop' that comes and goes, and does not stop 
      the user clicking on something you don't need to start a session here.

      If they MUST click on the screensaver to begin, then DO start the session here because
      they've started doing something!

      analytics.startSession()
    */
  }, []);

  // Cleanup when the session is over
  const appIsIdle = useCallback(() => {
    config.logging.idleState && console.log("[APPLICATION] Idle");

    // Hide any glosses left open
    glossRef.current.hide();

    // set language to the default
    setLanguage(config.i18n.defaultLocale);

    analytics.endSession();

    // return the application to the home page (with no analytics)
    browserHistory.push("/", "reset");

    screenSaver.current.start();
  }, [browserHistory, setLanguage]);

  useEffect(() => {
    /* 
      NB: This causes a second render at startup when the gloss reference is set.
      See gloss module for more information on why this is needed
    */
    setGloss(glossRef.current);
  }, [setGloss]);

  useEffect(() => {
    // start watching for route changes AFTER the above startup regime
    // we don't want the first page render to register on startup as this
    // can throw off page view stats
    const unlisten = listenForRouteChanges(analytics, browserHistory);

    return unlisten;
    // ignore linting rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScreenSaver
        attractorFadeDuration={config.screenSaver.attractorFadeDuration}
        attractorHideDuration={config.screenSaver.attractorHideDuration}
        attractorShowDuration={config.screenSaver.attractorShowDuration}
        ref={screenSaver}
      />
      <IdleTimer
        ref={idleTimer}
        onActive={appIsActive}
        onIdle={appIsIdle}
        debounce={250}
        timeout={config.screenSaver.idleTimeout * 1000}
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

export default Kiosk;
