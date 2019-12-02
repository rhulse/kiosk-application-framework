import Analytics from "../analytics/Analytics";
import GoogleAnalyticsProvider from "../analytics/googleGA";

import config from "../configuration";

const googleProvider = new GoogleAnalyticsProvider({
  providerId: config.analytics.providers.googleGA,
  defaultLanguage: config.i18n.defaultLocale,
  applicationName: config.application.name,
  applicationVersion: config.application.version,
  logging: config.analytics.logging,
  debug: config.analytics.debug
});

export const analytics = new Analytics({
  providers: [googleProvider],
  idleTimeout: config.screenSaver.idleTimeout * 1000,
  useEstimatedSessionTiming: config.analytics.useEstimatedSessionTiming,
  logging: config.analytics.logging
});
