import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import layoutEN from './locales/en/layout.json';
import layoutES from './locales/es/layout.json';
import mainpageEN from './locales/en/mainPage.json';
import mainpageES from './locales/es/mainPage.json';
import profilepageEN from './locales/en/profilePage.json';
import profilepageES from './locales/es/profilePage.json';
import statspageES from './locales/es/statsPage.json';
import statspageEN from './locales/en/statsPage.json';

const resources = {
  en: {
    layout: layoutEN,  // Namespace para el layout
    mainpage: mainpageEN, // Namespace para MainPage
    profilepage: profilepageEN, // Namespace para ProfilePage
    statspage: statspageEN  // Namespace para StatsPage
  },
  es: {
    layout: layoutES,
    mainpage: mainpageES,
    profilepage: profilepageES,
    statspage: statspageES
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Idioma por defecto
    fallbackLng: 'es',
    ns: ['layout', 'mainpage'], // Definimos los namespaces a usar
    defaultNS: 'mainpage', // Namespace por defecto, en este caso 'mainpage'
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
