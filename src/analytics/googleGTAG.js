import { SET_LANGUAGE, PAGE_VIEW } from "./types";

/* 
  GTAG does not seem to support session control which is needed to track how
  an interactive is being used. This is included if anyone want to use it
  or for when session control are supported in the future.
*/

export default class GoogleGtag {
  constructor(providerId = null, defaultLanguage) {
    // this.ga = null;

    if (providerId === null) {
      console.log(
        "Initialsing GA Analytics: No provider ID - logging to console instead."
      );
      this.initialised = false;
      return null;
    } else {
      console.log("Initialsing GTAG Analytics.");
      this.initialise(providerId, defaultLanguage);
      this.initialised = true;
      this.providerID = providerId;
    }
  }

  initialise(providerID, defaultLanguage) {
    /*
      NB: The global snippet MUST be on the page, or event data will not be sent
    */

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
    this.gtag("config", this.providerID, { page_path: "url" });
  }

  gtag(...args) {
    // ga must be accessed this way, creating an alias does not work
    if (window.ga) {
      window.gtag(...args);
    } else {
      console.log(...args);
    }
  }
}
