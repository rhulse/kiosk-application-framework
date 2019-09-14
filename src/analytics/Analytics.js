import { useTracking } from "react-tracking";
// gtag is our connector for analytics - it could be anything.
import { SET_LANGUAGE, PAGE_VIEW } from "./types";
import config from "../configuration";

import GoogleAnalyticsProvider from "./googleGA";

const provider = new GoogleAnalyticsProvider(
  config.analytics.googleGA,
  config.i18n.defaultLocale
);

// used by the react-tracker provider
export const analyticsDispatcher = event => {
  provider.dispatch(event);
};

export function useAnalytics(props) {
  return new Analytics();
}

class Analytics {
  constructor() {
    this.tracker = useTracking();
    this.trackRaw = this.tracker.trackEvent;
  }

  setLanguage(language) {
    this.trackRaw({
      type: SET_LANGUAGE,
      payload: { language: language }
    });
  }

  event(event) {}

  pageView(url) {
    this.trackRaw({
      type: PAGE_VIEW,
      payload: { url: url }
    });
  }

  trackRaw(args) {
    return this.trackRaw(args);
  }
}
