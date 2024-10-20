import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import layoutEN from './locales/en/layout.json';
import layoutES from './locales/es/layout.json';
import layoutCAT from './locales/cat/layout.json';
import layoutBA from './locales/ba/layout.json';
import mainpageEN from './locales/en/mainPage.json';
import mainpageES from './locales/es/mainPage.json';
import mainpageCAT from './locales/cat/mainPage.json';
import mainpageBA from './locales/ba/mainPage.json';
import offerspageEN from './locales/en/offersPage.json';
import offerspageES from './locales/es/offersPage.json';
import offerspageCAT from './locales/cat/offersPage.json';
import offerspageBA from './locales/ba/offersPage.json';
import profilepageEN from './locales/en/profilePage.json';
import profilepageES from './locales/es/profilePage.json';
import profilepageCAT from './locales/cat/profilePage.json';
import profilepageBA from './locales/ba/profilePage.json';
import statspageES from './locales/es/statsPage.json';
import statspageEN from './locales/en/statsPage.json';
import statspageCAT from './locales/cat/statsPage.json';
import statspageBA from './locales/ba/statsPage.json';
 

const resources = {
  en: {
    layout: layoutEN,  // Namespace para el layout
    mainpage: mainpageEN, // Namespace para MainPage
    profilepage: profilepageEN, // Namespace para ProfilePage
    statspage: statspageEN,  // Namespace para StatsPage
    offerspage: offerspageEN // Namespace para OffersPage
  },
  es: {
    layout: layoutES,
    mainpage: mainpageES,
    profilepage: profilepageES,
    statspage: statspageES,
    offerspage: offerspageES
  },
  cat: {
    layout: layoutCAT,
    mainpage: mainpageCAT,
    profilepage: profilepageCAT,
    statspage: statspageCAT,
    offerspage: offerspageCAT
  },
  ba: {
    layout: layoutBA,
    mainpage: mainpageBA,
    profilepage: profilepageBA,
    statspage: statspageBA,
    offerspage: offerspageBA
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Idioma por defecto
    fallbackLng: 'es',
    ns: ['layout', 'mainpage', 'profilepage', 'statspage', 'offerspage'], // Definimos los namespaces a usar
    defaultNS: 'mainpage', // Namespace por defecto, en este caso 'mainpage'
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
