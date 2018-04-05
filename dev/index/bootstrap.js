import 'whatwg-fetch';
import Zergling from '../helpers/zergling';
import Config from "../config/main";
import Helpers from "../helpers/helperFunctions";
import Translator from "../helpers/translator";
import {persistStore, createTransform} from 'redux-persist';
import {Connected, Disconnected, SessionLost, SessionActive} from '../actions/swarm';
import {ReallyLoggedIn, LoggedIn, LoggedOut, LoginStart} from '../actions/login';
import {PreferencesSet, AppReady} from '../actions/';
import fetchJsonp from "fetch-jsonp";
import countries from "../constants/countries";
import {updateTranslations} from "../constants/errorCodes";
import {CmsLoadPage} from "../actions/cms";
import {StoreHashParams} from "../actions/hashParams";

var Bootstrap = (store) => loadConfig(store).then((notrans) => {
    return loadTranslations(store, notrans).then(() => {
        updateTranslations();
        store.dispatch(AppReady());
    });
});

export default Bootstrap;

/**
 * Initialise Zergling with login state callback
 * must be called after loading/mergin configs
 * @param store
 */
function initZergling (store) {
    Zergling.init(function (state) {
        if (state.connected !== undefined) {
            return store.dispatch(state.connected ? Connected(state) : Disconnected(state));
        }
        if (state.hasSession !== undefined) {
            return store.dispatch(state.hasSession ? SessionActive(state) : SessionLost(state));
        }
        if (state.reallyLoggedIn !== undefined) { // the real state(not the one shown in ui)
            store.dispatch(ReallyLoggedIn(state.reallyLoggedIn === Zergling.loginStates.LOGGED_IN));
        }
        if (state.loggedIn !== undefined) {
            var action = {
                [Zergling.loginStates.LOGGED_IN]: LoggedIn,
                [Zergling.loginStates.LOGGED_OUT]: LoggedOut,
                [Zergling.loginStates.IN_PROGRESS]: LoginStart
            }[state.loggedIn];
            return store.dispatch(action(state));
        }
    });
}

/**
 * Load translations
 * @returns {Promise}
 */
function loadTranslations (store, notrans) {
    return new Promise(function (resolve) {
        let prefix = Config.translations || /languages/,
            preferences = store.getState().preferences,
            countryCode = countries.iso2ToIso3[preferences.geoData && preferences.geoData.countryCode],
            isLanguageAvailable = Config.main.availableLanguages.hasOwnProperty(countryCode),
            lang = preferences.lang || (preferences.geoData && isLanguageAvailable && countryCode.toLowerCase()) || Config.env.lang;
        Translator.setLanguage(lang);
        store.dispatch(PreferencesSet("lang", lang));
        !notrans
            ? fetch(prefix + `${lang}.json`).then(response => response.json()).then(function (json) {
                if (json[lang]) {
                    Translator.setTranslations(json[lang], lang);
                }
                resolve();
            }).catch(function (ex) {
                console.warn("translations not loaded", ex);
                resolve(ex);
            })
            : resolve();

    });
}

function generatePaymentByCurrency (item, suffix, collected) {
    let transactionCurrencies = item[`${suffix}Currencies`];
    if (transactionCurrencies && transactionCurrencies.length) {
        collected[suffix] = collected[suffix] || {};
        for (let i = 0, length = transactionCurrencies.length; i < length; i++) {
            collected[suffix][transactionCurrencies[i]] = collected[suffix][transactionCurrencies[i]] || [];
            collected[suffix][transactionCurrencies[i]].indexOf(item.name) === -1 && collected[suffix][transactionCurrencies[i]].push(item.name);
        }
    }
}

/**
 *  - Loads stored state from local config and puts into store
 *  - Loads config from external file
 *  - Merges external config with Config object
 *  - Merges saved preferences from store with ones defined in config
 * @param store
 * @returns {Promise}
 */
function loadConfig (store) {

    let hashParams = Helpers.getHashParams() || {},
        notrans = Helpers.getQueryStringValue('notrans') !== null,
        allDone,
        persistentStoreKeys = ['persistentUIState', 'preferences', 'favorites', 'betslip'],
        options = {
            whitelist: persistentStoreKeys,
            transforms: [
                createTransform(
                    (state) => state,
                    (state) => {
                        return {...state, superBet: false};
                    },
                    {whitelist: 'betslip'}
                )
            ]
        },
        storeLoaded = new Promise((resolve) => persistStore(store, (() => {
            if (Config.betting.enableSuperBet) {
                delete options.transforms;
            }
            return options;
        })(), resolve)),
        configLoaded,
        loadGeoLocation,
        loadConfigsFromCms;

    // load external config and merge with Config
    configLoaded = new Promise(function (resolve) {
        let configUrl = location.hostname === "localhost" ? "/conf.local.json" : "/conf.json";
        fetch(configUrl).then(response => response.json()).then(function (json) {
            Helpers.mergeRecursive(Config, json);
            console.log("Merged config:", Config);
            resolve();
        }).catch(function (ex) {
            console.warn("external config not loaded", ex, ", proceeding with default one");
            resolve(ex);
        });
    });

    loadGeoLocation = new Promise(function (resolve) {

        window.angular = {
            callbacks: {
                "_0": function (response) {
                    let {countryCode, countryName, cityName, zipCode, latitude, longitude, ipAddress, statusCode} = response;
                    resolve({countryCode, countryName, cityName, zipCode, latitude, longitude, ipAddress, statusCode});
                }
            }
        };

        fetchJsonp(Config.main.geoipLink).then(function (json) {
            resolve(json);
        }).catch(function (ex) {
            resolve(ex);
        });
    });

    loadConfigsFromCms = new Promise(function (resolve) {

        if (Config.cms && Config.cms.configFromCmsLink && Config.cms.keysThatShouldBeMerged && Config.cms.keysThatShouldBeMerged.length) {
            fetch(Config.cms.configFromCmsLink, {
                "Content-type": "application/json; charset=utf-8"
            })
                .then(Helpers.checkStatus).then(response => response.json())
                .then((json) => {
                    let collected = {},
                        localizedObject = {...json},
                        paymentsByCurrency = {};

                    for (let i = 0; i < Config.cms.keysThatShouldBeMerged.length; i++) {
                        try {
                            let destinationObject = Helpers.GetObjectByStringPath(collected, Config.cms.keysThatShouldBeMerged[i].key);
                            let props = Helpers.GetObjectByStringPath(localizedObject, Config.cms.keysThatShouldBeMerged[i].path) || [];
                            Config.main.additionalPayments && Config.cms.keysThatShouldBeMerged[i].key === "main.payments" && (props = props.concat(Config.main.additionalPayments));
                            !destinationObject && Helpers.AssignValueToPropName(collected, Config.cms.keysThatShouldBeMerged[i].key, props);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    Helpers.mergeRecursive(Config, {...collected});

                    Config.main.payments && Config.main.payments.reduce((collected, item) => {
                        generatePaymentByCurrency(item, "deposit", collected);
                        generatePaymentByCurrency(item, "withdraw", collected);
                        return collected;
                    }, paymentsByCurrency);

                    Config.main.paymentByCurrency = paymentsByCurrency;
                    resolve();
                }).catch(() => {
                    resolve();
                });
        } else {
            resolve();
        }
    });

    Promise.all([storeLoaded, configLoaded, loadGeoLocation, loadConfigsFromCms]).then(function (responses) {
        let geoData = responses[2];

        geoData && geoData.statusCode && geoData.statusCode.toLowerCase() === "ok" && store.dispatch(PreferencesSet("geoData", Object.assign({}, geoData)));
        //now we have our final config, we can initialize Zergling (Zergling uses some config values)
        initZergling(store);

        let promo = {
            btag: store.getState().persistentUIState.hashParams.btag
        };

        store.dispatch(StoreHashParams(promo)); //reset hash params to prevent opening unnecessary popups

        // Merge saved preferences from state with Config.env

        let languageFromUrl = Helpers.getUriParam("lang"),
            isPassedLanguageSupported = languageFromUrl && Config.main.availableLanguages.hasOwnProperty(languageFromUrl),
            state = store.getState(),
            geoLocationLanguage = geoData && !Config.main.disableGeoLocationLanguage
                ? Config.main.geoIPLangSwitch && Config.main.geoIPLangSwitch.enabled
                    ? Config.main.geoIPLangSwitch[geoData.countryCode] || Config.main.geoIPLangSwitch.default
                    : Config.main.availableLanguages.hasOwnProperty((countries.iso2ToIso3[geoData.countryCode] || "").toLowerCase())
                        ? countries.iso2ToIso3[geoData.countryCode].toLowerCase()
                        : Config.env.lang
                : Config.env.lang,
            defaultLanguage = !state.preferences.lang
                ? Config.main.availableLanguages.hasOwnProperty(languageFromUrl)
                    ? languageFromUrl
                    : geoLocationLanguage
                : (isPassedLanguageSupported && languageFromUrl) || Config.main.availableLanguages.hasOwnProperty(state.preferences.lang) && state.preferences.lang || Config.env.lang,
            init = {
                ...state.preferences,
                lang: defaultLanguage
            };

        if (Config.main.preloadPromotions && defaultLanguage) {
            store.dispatch(CmsLoadPage("promotions-" + defaultLanguage, defaultLanguage, "promotions"));
        }

        if (state && state.preferences) {
            Helpers.mergeRecursive(Config.env, init);
        }

        // Save Config.env to store
        Object.keys(Config.env).map(k => {
            store.dispatch(PreferencesSet(k, Config.env[k]));
        });

        if (Object.keys(hashParams).length) {
            if (!hashParams.btag) {
                hashParams = {
                    ...hashParams,
                    ...promo
                };
            }
            store.dispatch(StoreHashParams(hashParams));
        }

        console.log("store:", state, "config:", Config);

        allDone(notrans);
    });

    return new Promise(resolve => {
        allDone = resolve;
    });

}