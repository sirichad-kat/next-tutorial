import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as UiConfigAction from "../redux/actions/UiConfigAction";
import i18n from "../i18n/i18n";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import ServiceUrl from "../configs/servicePath";

export default function Home() {

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);

  useEffect(() => {
    console.log("RESET PROGRAM NAME")
    dispatch(UiConfigAction.setProgramName(""))

    //re-initialize i18n

    const languageDetector = new LanguageDetector();

    languageDetector.addDetector({
      name: "user-session-lang",
      lookup(options) {
        const lang = userInfo ? userInfo.language.toLowerCase() : "eng";
        console.log("LANGUAGE DETECTION: ", lang);
        return lang;
      },
    });

    const user_connection = userInfo ? userInfo.connection : "";

    const user_token = userInfo ? userInfo.token : "";

    const backendOptions = {
      loadPath: ServiceUrl.urlBase + "Locale/{{lng}}/{{ns}}",
      queryStringParams: { connection: user_connection },
      customHeaders: {
        authorization: `Bearer ${user_token}`,
      },
      addPath: ServiceUrl.urlBase + "Locale/Add/{{lng}}/{{ns}}",
      parsePayload: function (namespace, key, fallbackValue) {
        return {
          key: key,
          value: fallbackValue,
          namespace: namespace,
        };
      },
    };

    const detectionOptions = {
      order: [
        "user-session-lang",
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
    };

    i18n
      .use(Backend)
      .use(languageDetector)
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
        resources: {},
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        // lng: "eng",
        fallbackLng: "eng", // if the language is not available, use the fallback language specified here
        interpolation: {
          escapeValue: false, // react already safes from xss
        },
        backend: backendOptions,
        detection: detectionOptions,
        react: {
          useSuspense: false,
        },
        partialBundledLanguages: true,
        saveMissing: true,
      });
  }, [])

  return (
    <div>
    </div>
  );
}
