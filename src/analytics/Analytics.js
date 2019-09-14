import { SET_LANGUAGE, PAGE_VIEW } from "./types";
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

  event(event) {
    console.log(event);
  }

  pageView(url) {
    this.dispatch({
      type: PAGE_VIEW,
      payload: { url: url }
    });
  }

  trackRaw(args) {
    return this.dispatch(args);
  }
}
