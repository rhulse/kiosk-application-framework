import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import English from "./content/locales/en";
import Māori from "./content/locales/mi";

import config from "./configuration";

const resources = {
  en: English,
  mi: Māori
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: config.i18n.defaultLocale,

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
