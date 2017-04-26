/**
 * Translator service
 * setTranslations and setLanguage are called once on application bootstrap to set translations data and language
 * t(string)  translates string or returns original string if translation is not found.
 * @type {{setTranslations, setLanguage, t}}
 */
const Translator = (function () {
    const allTranslations = {};
    var currentLanguage = "eng";

    return {
        setTranslations (translations, language) {
            allTranslations[language] = translations;
        },
        setLanguage (lang) {
            currentLanguage = lang;
            allTranslations[currentLanguage] = allTranslations[currentLanguage] || {};
        },
        t (str, ...args) {
            var ret = (allTranslations[currentLanguage] && allTranslations[currentLanguage][str]) || str;
            args.length && args.map((arg, i) => {
                ret = ret.replace(`{${i + 1}}`, arg);
            });
            return ret;
        }
    };

})();

export const t = Translator.t;

export default Translator;