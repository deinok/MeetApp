import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { isMobile } from "react-device-detect";

import layoutEN from "./locales/web/en/layout.json";
import layoutES from "./locales/web/es/layout.json";
import layoutBA from "./locales/web/ba/layout.json";
import loginpageEN from "./locales/web/en/loginPage.json";
import loginpageES from "./locales/web/es/loginPage.json";
import loginpageBA from "./locales/web/ba/loginPage.json";
import mainpageEN from "./locales/web/en/mainPage.json";
import mainpageES from "./locales/web/es/mainPage.json";
import mainpageBA from "./locales/web/ba/mainPage.json";
import offerspageEN from "./locales/web/en/offersPage.json";
import offerspageES from "./locales/web/es/offersPage.json";
import offerspageBA from "./locales/web/ba/offersPage.json";
import profilepageEN from "./locales/web/en/profilePage.json";
import profilepageES from "./locales/web/es/profilePage.json";
import profilepageBA from "./locales/web/ba/profilePage.json";
import statspageES from "./locales/web/es/statsPage.json";
import statspageEN from "./locales/web/en/statsPage.json";
import statspageBA from "./locales/web/ba/statsPage.json";
import registerpageES from "./locales/web/es/registerPage.json";

// Mobile
import mobileLayoutES from "./locales/mobile/es/layout.json";
import mobileActivitiesES from "./locales/mobile/es/activitiesPage.json";
import mobileLoginES from "./locales/mobile/es/loginPage.json";
import mobileRegisterES from "./locales/mobile/es/registerPage.json";
import mobileProfileES from "./locales/mobile/es/profilePage.json";
import mobileMainES from "./locales/mobile/es/mainPage.json";

import mobileLayoutEN from "./locales/mobile/en/layout.json";
import mobileActivitiesEN from "./locales/mobile/en/activitiesPage.json";
import mobileLoginEN from "./locales/mobile/en/loginPage.json";
import mobileRegisterEN from "./locales/mobile/en/registerPage.json";
import mobileProfileEN from "./locales/mobile/en/profilePage.json";
import mobileMainEN from "./locales/mobile/en/mainPage.json";

import mobileLayoutBA from "./locales/mobile/ba/layout.json";
import mobileActivitiesBA from "./locales/mobile/ba/activitiesPage.json";
import mobileLoginBA from "./locales/mobile/ba/loginPage.json";
import mobileRegisterBA from "./locales/mobile/ba/registerPage.json";
import mobileProfileBA from "./locales/mobile/ba/profilePage.json";
import mobileMainBA from "./locales/mobile/ba/mainPage.json";

const webResources = {
  en: {
    layout: layoutEN, // Namespace para el layout
    loginpage: loginpageEN, // Namespace para LoginPage
    mainpage: mainpageEN, // Namespace para MainPage
    profilepage: profilepageEN, // Namespace para ProfilePage
    statspage: statspageEN, // Namespace para StatsPage
    offerspage: offerspageEN, // Namespace para OffersPage
  },
  es: {
    layout: layoutES,
    loginpage: loginpageES,
    mainpage: mainpageES,
    profilepage: profilepageES,
    statspage: statspageES,
    offerspage: offerspageES,
    registerpage: registerpageES,
  },
  ba: {
    layout: layoutBA,
    loginpage: loginpageBA,
    mainpage: mainpageBA,
    profilepage: profilepageBA,
    statspage: statspageBA,
    offerspage: offerspageBA,
  },
};

const mobileResources = {
  es: {
    layout: mobileLayoutES,
    activitiespage: mobileActivitiesES,
    loginpage: mobileLoginES,
    registerpage: mobileRegisterES,
    profilepage: mobileProfileES,
    mainpage: mobileMainES,
  },
  en: {
    layout: mobileLayoutEN,
    activitiespage: mobileActivitiesEN,
    loginpage: mobileLoginEN,
    registerpage: mobileRegisterEN,
    profilepage: mobileProfileEN,
    mainpage: mobileMainEN,
  },
  ba: {
    layout: mobileLayoutBA,
    activitiespage: mobileActivitiesBA,
    loginpage: mobileLoginBA,
    registerpage: mobileRegisterBA,
    profilepage: mobileProfileBA,
    mainpage: mobileMainBA,
  },
};

export const initialLanguage =
  localStorage.getItem("language") ??
  window.navigator.language.split("-")[0] ??
  "es";

if (isMobile) {
  i18n.use(initReactI18next).init({
    resources: mobileResources,
    lng: initialLanguage, // Idioma por defecto
    fallbackLng: "es",
    ns: [
      "layout",
      "mainpage",
      "profilepage",
      "chatspage",
      "offerspage",
      "loginpage",
      "registerpage",
      "activitiespage",
    ], // Definimos los namespaces a usar
    defaultNS: "mainpage", // Namespace por defecto, en este caso 'mainpage'
    interpolation: {
      escapeValue: false,
    },
  });
} else {
  i18n.use(initReactI18next).init({
    resources: webResources,
    lng: initialLanguage, // Idioma por defecto
    fallbackLng: "es",
    ns: [
      "layout",
      "mainpage",
      "profilepage",
      "statspage",
      "offerspage",
      "loginpage",
      "registerpage",
    ], // Definimos los namespaces a usar
    defaultNS: "mainpage", // Namespace por defecto, en este caso 'mainpage'
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
