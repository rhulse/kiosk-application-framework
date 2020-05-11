import { SET_LANGUAGE, PAGE_VIEW } from "../types";

/* 
  GTAG does not seem to support session control which is needed to track how
  an interactive is being used. This is included if anyone want to use it
  or for when session control are supported in the future.
*/

export default class GoogleGtagProvider {
  constructor({
    providerId,
    defaultLanguage,
    applicationName,
    applicationVersion,
    debug,
    consoleLogging,
  }) {
    console.log("Initialsing GA Analytics.");

    this.debug = debug;
    this.consoleLoggging = consoleLogging;

    if (providerId) {
      this.initialise(
        providerId,
        defaultLanguage,
        applicationName,
        applicationVersion
      );
    } else {
      console.log("No provider ID - logging to console instead.");
      return;
    }
  }

  initialise(providerID, defaultLanguage, applicationName, applicationVersion) {
    /*
      NB: The global snippet MUST be on the page, or event data will not be sent
    */
    if (!providerID) return;

    const script = document.createElement("script");
    script.async = 1;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${providerID}`;
    document.head.appendChild(script);

    const gtagSetup = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${providerID}', { 'send_page_view': false } );`;

    const scriptCode = document.createElement("script");
    scriptCode.innerHTML = gtagSetup;
    document.head.appendChild(scriptCode);
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

      default:
        break;
    }
  }

  pageView(url) {
    this.consoleLoggging && console.log("[PAGEVIEW]", url);
    this._dispatchToProvider("config", this.providerID, { page_path: "url" });
  }

  _dispatchToProvider(...args) {
    // ga must be accessed this way, creating an alias does not work
    if (window.ga) {
      window.gtag(...args);
    } else {
      console.log(...args);
    }
  }
}
