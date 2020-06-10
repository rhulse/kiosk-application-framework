import { AnalyticsDispatcher, GoogleGA } from "analytics-provider";

import config from "../configuration";

const googleProvider = new GoogleGA({
  providerId: config.analytics.providers.googleGA,
  loggingLevel: config.analytics.loggingLevel,
  debug: config.analytics.debug,
});

export const analytics = new AnalyticsDispatcher({
  providers: [googleProvider],
  loggingLevel: config.analytics.loggingLevel,
  trackPageTime: true,
  trackSessionTime: true,
  idleTimeout: config.screenSaver.idleTimeout * 1000,
  adjustSessionTimingForTimeout: config.analytics.useEstimatedSessionTiming,
});
