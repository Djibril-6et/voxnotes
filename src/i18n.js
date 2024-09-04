import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // Charge les traductions via HTTP (fichiers .json)
  .use(LanguageDetector) // Détecte la langue du navigateur ou d'autres sources
  .use(initReactI18next) // Passe i18n à react-i18next
  .init({
    supportedLngs: ["en", "fr", "pt", "es"], // Les langues supportées
    fallbackLng: "en", // La langue de secours si la langue actuelle n'est pas disponible
    debug: true, // Définir à true pour voir les messages de débogage

    interpolation: {
      escapeValue: false, // React se charge déjà d'échapper les valeurs
    },

    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Où les fichiers de traduction sont situés
    },
  });

export default i18n;
