import { SET_LANGUAGE, PAGE_VIEW, EVENT } from "./types";

export default class GoogleGA {
  constructor(providerId, defaultLanguage, debug = false) {
    console.log("Initialsing GA Analytics.");

    this.debug = debug;

    if (providerId) {
      this.initialise(providerId, defaultLanguage);
    } else {
      console.log("No provider ID - logging to console instead.");
      return;
    }
  }

  initialise(providerID, defaultLanguage) {
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
    this.setLanguage(defaultLanguage);
  }

  ga(...args) {
    console.log(...args);
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

      case EVENT:
        this.event(payload.eventData);
        break;

      default:
        break;
    }
  }

  // ga('send', 'pageview', [page], [fieldsObject]);
  pageView(url) {
    this.ga("set", "page", url);
    this.ga("send", "pageview");
  }

  setLanguage(lang) {
    this.ga("set", "language", lang);
    this.event({
      eventCategory: "Language",
      eventAction: "Change",
      eventLabel: lang
    });
  }

  // ga('send', 'event', [eventCategory]*, [eventAction]*, [eventLabel], [eventValue], [fieldsObject]);
  event(eventData) {
    // console.log("[EVENT]", eventData);
    this.ga("send", "event", eventData);
  }

  // ga('send', 'timing', [timingCategory], [timingVar], [timingValue], [timingLabel], [fieldsObject]);
  timing(timingData) {
    // console.log("[TIMING]", timingData);
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