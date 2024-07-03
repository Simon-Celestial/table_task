import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import langEN from "/public/translations/en.json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import langRU from "/public/translations/ru.json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import langAZ from "/public/translations/az.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: langEN,
            },
            ru: {
                translation: langRU,
            },
            az: {
                translation: langAZ,
            }

        },
        lng: 'en',
        fallbackLng: 'ru',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;