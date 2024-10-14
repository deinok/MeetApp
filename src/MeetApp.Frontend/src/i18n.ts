import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import layoutEN from './locales/en/layout.json';
import layoutES from './locales/es/layout.json';
import mainpageEN from './locales/en/mainpage.json';
import mainpageES from './locales/es/mainpage.json';

const resources = {
  en: {
    layout: layoutEN,  // Namespace para el layout
    mainpage: mainpageEN // Namespace para MainPage
  },
  es: {
    layout: layoutES,
    mainpage: mainpageES
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
