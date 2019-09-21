import {
  SET_LANGUAGE,
  PAGE_VIEW,
  EVENT,
  TIMING,
  SESSION,
  SET_PAGE
} from "./types";
import config from "../configuration";

import timeTracker from "../analytics/TimeTracker";

import GoogleAnalyticsProvider from "./googleGA";
import SessionTracker from "./SessionTracker";

const provider = new GoogleAnalyticsProvider({
  providerId: config.analytics.googleGA,
  defaultLanguage: config.i18n.defaultLocale,
  applicationName: config.application.name,
  applicationVersion: config.application.version,
  debug: false,
  consoleLogging: true
});

class Analytics {
  constructor(provider, timeTracker) {
    this.dispatch = (...args) => provider.dispatch(...args);
    this.session = new SessionTracker(timeTracker);
    this.timeTracker = timeTracker;
    this.timeOnPage = null;
    this.currentPageURL = null;

    // Most apps will start at root. Change this is URL if not.
    this.setPage("/");
  }

  setLanguage(language) {
    this.startSession({ withEvent: true });
    this.dispatch({
      type: SET_LANGUAGE,
      payload: { language: language }
    });
  }

  event(eventData) {
    this.startSession({ withEvent: true });
    this.dispatch({
      type: EVENT,
      payload: { eventData: eventData }
    });
  }

  setPage(url) {
    this.currentPageURL = url;

    this.dispatch({
      type: SET_PAGE,
      payload: { url: url }
    });
  }

  pageView(url) {
    this.startSession();

    // This is always logging the duration of the PREVIOUS page view, not the one just set.
    if ((this.timeOnPage = this.timeTracker.restartTimer("pageView"))) {
      this.pageTime(this.timeOnPage, this.currentPageURL);
    }

    this.currentPageURL = url;

    this.dispatch({
      type: PAGE_VIEW,
      payload: { url: url }
    });
  }

  pageTime(time, previousPageURL) {
    this.timing({
      timingCategory: "Page View",
      timingVar: "Length",
      timingValue: this.timeOnPage,
      timingLabel: previousPageURL
    });
    this.timing(time);
  }

  timing(timingData) {
    this.dispatch({
      type: TIMING,
      payload: { timingData: timingData }
    });
  }

  startSession(args) {
    const { withEvent } = args || false;

    if (this.session.running) {
      return;
    }

    this.session.start();

    // start page timer if an event started the session
    if (withEvent) {
      this.timeTracker.startTimer("pageView");
    }

    this.dispatch({
      type: SESSION,
      payload: { state: "start" }
    });
  }

  endSession(finalPage) {
    const durationOfSession = this.session.end();

    if (!this.session.running || !durationOfSession) {
      return;
    }

    // fake page so as not to skew real page views
    this.setPage("session-end");
    this.dispatch({
      type: SESSION,
      payload: { state: "end" }
    });

    // send a timing event with the duration
    this.timing({
      timingCategory: "Session",
      timingVar: "Length",
      timingValue: durationOfSession
    });

    // stop all tracking
    this.timeTracker.reset();

    // restore orignal page state after fake session page
    this.setPage(finalPage);
  }

  raw(args) {
    return this.dispatch(args);
  }
}

export const analytics = new Analytics(provider, timeTracker);

export function useAnalytics(props) {
  return analytics;
}
