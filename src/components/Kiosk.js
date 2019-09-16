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
import timeTracker from "../analytics/TimeTracker";

const listenForRouteChanges = (analytics, history) => {
  let timeOnPage = null;
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

    if ((timeOnPage = timeTracker.restartTimer("pageView"))) {
      analytics.timing({
        timingCategory: "Page",
        timingVar: "View Length",
        timingValue: timeOnPage
      });
    }
  });
};

function Kiosk(props) {
  const glossRef = useRef(null);
  const idleTimer = useRef(null);
  const screenSaver = useRef(null);
  const { dispatch } = useContext(PrefsContext);
  const analytics = useAnalytics();

  const browserHistory = props.history;

  const appIsActive = useCallback(() => {
    screenSaver.current.stop();
    timeTracker.startTimer("session");

    // manually start the session in case the first action is not tracker
    analytics.setPage("session"); // fake page so as not to skew real page views
    analytics.startSession();
    // restore orignal page state after fake session page
    analytics.setPage(browserHistory.location.pathname);
  }, [analytics, browserHistory]);

  // Cleanup when the session is over
  const appIsIdle = useCallback(() => {
    // Hide any glosses left open
    glossRef.current.hide();

    // set language to the default
    dispatch({ type: SET_LANGUAGE, language: config.i18n.defaultLocale });

    screenSaver.current.start();

    // stop session manually and send a seperate timing event
    let elapsedTime = timeTracker.stopTimer("session");
    analytics.setPage("session"); // fake page so as not to skew real page views
    analytics.endSession(elapsedTime);
    // restore orignal page state after fake session page
    analytics.setPage(browserHistory.location.pathname);

    // return the application to the home page (with no analytics)
    browserHistory.push("/", "reset");
  }, [browserHistory, dispatch, analytics]);

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
    const unlisten = listenForRouteChanges(analytics, browserHistory);

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
