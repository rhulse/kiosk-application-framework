import {
  SET_LANGUAGE,
  PAGE_VIEW,
  EVENT,
  TIMING,
  SESSION,
  SET_PAGE
} from "./types";
import config from "../configuration";

import GoogleAnalyticsProvider from "./googleGA";

const provider = new GoogleAnalyticsProvider(
  config.analytics.googleGA,
  config.i18n.defaultLocale
);

export function useAnalytics(props) {
  return new Analytics();
}

export class Analytics {
  constructor() {
    this.dispatch = (...args) => provider.dispatch(...args);
  }

  setLanguage(language) {
    this.dispatch({
      type: SET_LANGUAGE,
      payload: { language: language }
    });
  }

  event(eventData) {
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
    this.dispatch({
      type: SESSION,
      payload: { state: "start" }
    });
  }

  endSession(durationOfSession) {
    this.dispatch({
      type: SESSION,
      payload: { state: "end" }
    });
    // send a timing event with the duration
    this.timing({
      timingCategory: "Session",
      timingVar: "Duration",
      timingValue: durationOfSession
    });
  }

  raw(args) {
    return this.dispatch(args);
  }
}
