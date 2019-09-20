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
  constructor(provider) {
    this.dispatch = (...args) => provider.dispatch(...args);
    this.session = new SessionTracker(timeTracker);
  }

  setLanguage(language) {
    this.startSession();
    this.dispatch({
      type: SET_LANGUAGE,
      payload: { language: language }
    });
  }

  event(eventData) {
    this.startSession();
    this.dispatch({
      type: EVENT,
      payload: { eventData: eventData }
    });
  }

  setPage(url) {
    this.dispatch({
      type: SET_PAGE,
      payload: { url: url }
    });
  }

  pageView(url) {
    this.startSession();

    this.dispatch({
      type: PAGE_VIEW,
      payload: { url: url }
    });
  }

  timing(timingData) {
    this.dispatch({
      type: TIMING,
      payload: { timingData: timingData }
    });
  }

  startSession() {
    if (this.session.running) {
      return;
    }

    this.session.start();

    this.dispatch({
      type: SESSION,
      payload: { state: "start" }
    });
  }

  endSession(finalPage) {
    const durationOfSession = this.session.end();
    if (!durationOfSession) {
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

    // restore orignal page state after fake session page
    this.setPage(finalPage);
  }

  raw(args) {
    return this.dispatch(args);
  }
}

export const analytics = new Analytics(provider);

export function useAnalytics(props) {
  return analytics;
}
