import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { isMobile } from "react-device-detect";

import layoutEN from "./locales/web/en/layout.json";
import layoutES from "./locales/web/es/layout.json";
import layoutBS from "./locales/web/bs/layout.json";
import loginpageEN from "./locales/web/en/loginPage.json";
import loginpageES from "./locales/web/es/loginPage.json";
import loginpageBS from "./locales/web/bs/loginPage.json";
import mainpageEN from "./locales/web/en/mainPage.json";
import mainpageES from "./locales/web/es/mainPage.json";
import mainpageBS from "./locales/web/bs/mainPage.json";
import offerspageEN from "./locales/web/en/offersPage.json";
import offerspageES from "./locales/web/es/offersPage.json";
import offerspageBS from "./locales/web/bs/offersPage.json";
import profilepageEN from "./locales/web/en/profilePage.json";
import profilepageES from "./locales/web/es/profilePage.json";
import profilepageBS from "./locales/web/bs/profilePage.json";
import statspageES from "./locales/web/es/statsPage.json";
import statspageEN from "./locales/web/en/statsPage.json";
import statspageBS from "./locales/web/bs/statsPage.json";
import registerpageES from "./locales/web/es/registerPage.json";

// Mobile
import mobileGlobalES from "./locales/mobile/es/global.json";
import mobileLayoutES from "./locales/mobile/es/layout.json";
import mobileActivitiesES from "./locales/mobile/es/activitiesPage.json";
import mobileLoginES from "./locales/mobile/es/loginPage.json";
import mobileRegisterES from "./locales/mobile/es/registerPage.json";
import mobileProfileES from "./locales/mobile/es/profilePage.json";
import mobileMainES from "./locales/mobile/es/mainPage.json";

import mobileGlobalEN from "./locales/mobile/en/global.json";
import mobileLayoutEN from "./locales/mobile/en/layout.json";
import mobileActivitiesEN from "./locales/mobile/en/activitiesPage.json";
import mobileLoginEN from "./locales/mobile/en/loginPage.json";
import mobileRegisterEN from "./locales/mobile/en/registerPage.json";
import mobileProfileEN from "./locales/mobile/en/profilePage.json";
import mobileMainEN from "./locales/mobile/en/mainPage.json";

import mobileGlobalBS from "./locales/mobile/bs/global.json";
import mobileLayoutBS from "./locales/mobile/bs/layout.json";
import mobileActivitiesBS from "./locales/mobile/bs/activitiesPage.json";
import mobileLoginBS from "./locales/mobile/bs/loginPage.json";
import mobileRegisterBS from "./locales/mobile/bs/registerPage.json";
import mobileProfileBS from "./locales/mobile/bs/profilePage.json";
import mobileMainBS from "./locales/mobile/bs/mainPage.json";

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
  bs: {
    layout: layoutBS,
    loginpage: loginpageBS,
    mainpage: mainpageBS,
    profilepage: profilepageBS,
    statspage: statspageBS,
    offerspage: offerspageBS,
  },
};

const mobileResources = {
  es: {
    global: mobileGlobalES,
    layout: mobileLayoutES,
    activitiespage: mobileActivitiesES,
    loginpage: mobileLoginES,
    registerpage: mobileRegisterES,
    profilepage: mobileProfileES,
    mainpage: mobileMainES,
  },
  en: {
    global: mobileGlobalEN,
    layout: mobileLayoutEN,
    activitiespage: mobileActivitiesEN,
    loginpage: mobileLoginEN,
    registerpage: mobileRegisterEN,
    profilepage: mobileProfileEN,
    mainpage: mobileMainEN,
  },
  bs: {
    global: mobileGlobalBS,
    layout: mobileLayoutBS,
    activitiespage: mobileActivitiesBS,
    loginpage: mobileLoginBS,
    registerpage: mobileRegisterBS,
    profilepage: mobileProfileBS,
    mainpage: mobileMainBS,
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
    fallbackLng: "en",
    ns: [
      "global",
      "layout",
      "mainpage",
      "profilepage",
      "chatspage",
      "offerspage",
      "loginpage",
      "registerpage",
      "activitiespage",
    ], // Definimos los namespaces a usar
    defaultNS: "global", // Namespace por defecto, en este caso 'mainpage'
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
