import {
  SET_LANGUAGE,
  PAGE_VIEW,
  EVENT,
  TIMING,
  SESSION,
  SET_PAGE
} from "./types";

export default class GoogleGA {
  constructor({
    providerId,
    defaultLanguage,
    applicationName,
    applicationVersion,
    debug,
    logging
  }) {
    this.debug = debug;
    this.logging = logging;

    logging > 0 && console.log("Initialsing GA Analytics.");

    if (providerId) {
      this.initialise(
        providerId,
        defaultLanguage,
        applicationName,
        applicationVersion
      );
    } else {
      logging > 0 &&
        console.log("No provider ID - logging to console instead.");
      return;
    }
  }

  initialise(providerID, defaultLanguage, applicationName, applicationVersion) {
    if (!providerID) return;

    const analyticsScript = this.getScriptURL();

    /*
      We are using analytics.js rather than gtag.js because 
      the latter does not support session control. 
    */

    /* eslint-disable */
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, "script", analyticsScript, "ga");
    /* eslint-enable */

    this.ga("create", providerID, "auto");
    this.ga("set", "appName", applicationName);
    this.ga("set", "appVersion", applicationVersion);

    // initial language setting is done without sending an event (which would start a false session)
    this.setLanguage(defaultLanguage, false);
  }

  ga(...args) {
    // ga must be accessed this way, creating an alias does not work
    if (window.ga) {
      window.ga(...args);
    } else {
      console.log(...args);
    }
  }

  dispatch(event) {
    const { type, payload } = event;

    switch (type) {
      case SET_LANGUAGE:
        this.setLanguage(payload.language);
        break;

      case PAGE_VIEW:
        this.pageView(payload.url);
        break;

      case SET_PAGE:
        this.setPage(payload.url);
        break;

      case EVENT:
        this.event(payload.eventData);
        break;

      case TIMING:
        this.timing(payload.timingData);
        break;

      case SESSION:
        this.session(payload.state);
        break;

      default:
        break;
    }
  }

  // ga('send', 'pageview', [page], [fieldsObject]);
  pageView(url) {
    this.logging > 1 && console.log("[PAGEVIEW]", url);
    this.setPage(url);
    this.ga("send", "pageview");
  }

  setPage(url) {
    this.ga("set", "page", url);
  }

  setLanguage(lang, withEvent = true) {
    this.logging > 1 && console.log("[LANGUAGE]", lang);
    this.ga("set", "language", lang);
    withEvent &&
      this.event({
        eventCategory: "Language",
        eventAction: "Change",
        eventLabel: lang
      });
  }

  // ga('send', 'event', [eventCategory]*, [eventAction]*, [eventLabel], [eventValue], [fieldsObject]);
  event(eventData) {
    this.logging > 1 && console.log("[EVENT]", eventData);
    this.ga("send", "event", eventData);
  }

  // ga('send', 'timing', [timingCategory], [timingVar], [timingValue], [timingLabel], [fieldsObject]);
  timing(timingData) {
    this.logging > 1 && console.log("[TIMING]", timingData);
    this.ga("send", "timing", timingData);
  }

  session(state) {
    this.logging > 1 && console.log("[SESSION]", state);
    this.ga("send", "pageview", { sessionControl: state });
  }

  // ga('send', 'screenview', [fieldsObject]);
  // [fieldsObject] = appName*, appId, appVersion, appInstallerId
  sreenView(screenData) {}

  getScriptURL() {
    if (this.debug) {
      return "https://www.google-analytics.com/analytics_debug.js";
    } else {
      return "https://www.google-analytics.com/analytics.js";
    }
  }
}
