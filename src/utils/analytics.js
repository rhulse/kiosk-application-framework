import AnalyticsDispatcher from "../analytics/AnalyticsDispatcher";
import GoogleAnalyticsProvider from "../analytics/providers/googleGA";

import config from "../configuration";

const googleProvider = new GoogleAnalyticsProvider({
  providerId: config.analytics.providers.googleGA,
  defaultLanguage: config.i18n.defaultLocale,
  applicationName: config.application.name,
  applicationVersion: config.application.version,
  loggingLevel: config.analytics.loggingLevel,
  debug: config.analytics.debug,
});

export const analytics = new AnalyticsDispatcher({
  providers: [googleProvider],
  idleTimeout: config.screenSaver.idleTimeout * 1000,
  useEstimatedSessionTiming: config.analytics.useEstimatedSessionTiming,
  loggingLevel: config.analytics.loggingLevel,
});
