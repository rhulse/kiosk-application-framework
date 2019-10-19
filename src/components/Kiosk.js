import React, { useRef, useEffect, useCallback } from "react";
import get from "lodash-es/get";

import config from "../configuration";
import { analytics } from "../analytics/Analytics";
import useRouter from "../hooks/useRouter";
import { useGlossDispatcher } from "../contexts/GlossContext";
import { useLanguage, useLanguageSetter } from "../contexts/LanguageContext";
import {
  dispatchStopMediaEvent,
  useGlossClickListeners
} from "../utils/dom-events";

import ScreenSaver from "./ScreenSaver";
import IdleTimer, { ACTIVE_EVENTS } from "./IdleTimer";
import Header from "./Header";
import Main from "./Main";
import Gloss from "./Gloss";
import FullScreenVideoPlayer from "./video/FullScreenVideoPlayer";

const listenForRouteChanges = (analytics, history) => {
  let previousPage = null;

  return history.listen((location, action) => {
    // if someone clicks on the same link again, we do nothing.
    if (previousPage === location.pathname) {
      return;
    }

    previousPage = location.pathname;

    // if this is a reset (the app is idle), we don't do a pageview either
    if (get(location, "state.action", false) === "reset") {
      return;
    }

    dispatchStopMediaEvent();

    analytics.pageView(location.pathname);
  });
};

function Kiosk(props) {
  const screenSaver = useRef(null);
  const setLanguage = useLanguageSetter();
  const language = useLanguage();

  const glossDispatcher = useGlossDispatcher();
  const { history: browserHistory } = useRouter();

  const appIsActive = useCallback(() => {
    config.screenSaver.logging > 0 && console.log("[APPLICATION] Active");

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
    // the url to return to when the app is idle
    const idleResetUrl = "/";

    config.screenSaver.logging > 0 && console.log("[APPLICATION] Idle");

    // Hide any glosses left open
    glossDispatcher({ action: "hide" });

    // set language to the default
    setLanguage(config.i18n.defaultLocale);

    // return the application to the home page (with no analytics)
    browserHistory.push(idleResetUrl, { action: "reset" });

    analytics.endSession(idleResetUrl);

    screenSaver.current.start();
  }, [browserHistory, setLanguage, glossDispatcher]);

  useGlossClickListeners(language, event => {
    event.preventDefault();
    glossDispatcher({ action: "show", callingEvent: event });
  });

  useEffect(() => {
    // start watching for route changes AFTER the above startup regime
    // we don't want the first page render to register on startup as this
    // can throw off page view stats
    const unlistenCallback = listenForRouteChanges(analytics, browserHistory);

    return unlistenCallback;
    // ignore linting rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="container">
        <Header />
        <Main />
      </div>
      <Gloss />
      <FullScreenVideoPlayer />
      <IdleTimer
        onActive={appIsActive}
        events={ACTIVE_EVENTS}
        onIdle={appIsIdle}
        debounce={250}
        timeout={config.screenSaver.idleTimeout * 1000}
        startOnLoad
      />
      <ScreenSaver
        attractorFadeDuration={config.screenSaver.attractorFadeDuration}
        attractorHideDuration={config.screenSaver.attractorHideDuration}
        attractorShowDuration={config.screenSaver.attractorShowDuration}
        ref={screenSaver}
      />
    </>
  );
}

export default Kiosk;
