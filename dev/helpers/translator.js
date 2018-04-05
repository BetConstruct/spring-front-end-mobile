/**
 * Translator service
 * setTranslations and setLanguage are called once on application bootstrap to set translations data and language
 * t(string)  translates string or returns original string if translation is not found.
 * @type {{setTranslations, setLanguage, t}}
 */
const Translator = (function () {
    const allTranslations = {};
    let currentLanguage = "eng",
        keys = [],
        originalKeys = [];

    return {
        setTranslations (translations, language) {
            allTranslations[language] = translations;
            (translations && translations.constructor === Object && (keys = Object.keys(translations).map((key) => (originalKeys.push(key) + 1) && key.toLowerCase())));
        },
        setLanguage (lang) {
            currentLanguage = lang;
            allTranslations[currentLanguage] = allTranslations[currentLanguage] || {};
        },
        t (str, ...args) {
            let ret = str;
            if (typeof ret === "string") {
                ret = (allTranslations[currentLanguage] && typeof allTranslations[currentLanguage][str] === "string")
                    ? allTranslations[currentLanguage][str]
                    : keys.includes(str.toLowerCase())
                        ? allTranslations[currentLanguage][originalKeys[keys.indexOf(str.toLowerCase())]]
                        : str;
            }

            args.length && args.map((arg, i) => {
                ret = ret.replace(`{${i + 1}}`, arg);
            });
            return ret;
        }
    };

})();

export const t = Translator.t;

export default Translator;