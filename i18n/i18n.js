import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import servicePath from "../configs/servicePath";

const languageDetector = new LanguageDetector();

let data = null;

if (typeof window !== "undefined") {
  // Client-side-only code
  data = window.sessionStorage.getItem("persist:root");
}

languageDetector.addDetector({
  name: 'user-session-lang',
  lookup(options) {
    const lang = data ? JSON.parse(JSON.parse(data).user).language.toLowerCase() : "eng";
    console.log("LANGUAGE DETECTION: ", lang)
    return lang;
  }
});

const user_connection = data ? JSON.parse(JSON.parse(data).user).connection : "";

const user_token = data ? JSON.parse(JSON.parse(data).user).token : "";

const backendOptions = {
  loadPath: servicePath.urlBase + 'Locale/{{lng}}/{{ns}}',
  queryStringParams: { connection: user_connection },
  customHeaders: {
    authorization: `Bearer ${user_token}`,
  },
  addPath: servicePath.urlBase + 'Locale/Add/{lng}}/{{ns}}',
}

const detectionOptions = {
  order: ['user-session-lang', 'querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
}

i18n
  .use(Backend)
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {},
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "eng", // if the language is not available, use the fallback language specified here
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    backend: backendOptions,
    detection: detectionOptions,
    react: {
      useSuspense: false
    },
    partialBundledLanguages: true
  });

export default i18n;