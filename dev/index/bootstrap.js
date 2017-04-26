import 'whatwg-fetch';
import Zergling from '../helpers/zergling';
import Config from "../config/main";
import Helpers from "../helpers/helperFunctions";
import Translator from "../helpers/translator";
import {persistStore} from 'redux-persist';
import {Connected, Disconnected, SessionLost, SessionActive} from '../actions/swarm';
import {ReallyLoggedIn, LoggedIn, LoggedOut, LoginStart} from '../actions/login';
import {PreferencesSet} from '../actions/';

var Bootstrap = (store) => loadConfig(store).then(() => { return loadTranslations(store); });

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
function loadTranslations (store) {
    return new Promise(function (resolve) {
        var prefix = Config.translations || /languages/;
        console.log("loading translations from", prefix);
        var lang = store.getState().preferences.lang;
        Translator.setLanguage(lang);
        fetch(prefix + `${lang}.json`).then(response => response.json()).then(function (json) {
            if (json[lang]) {
                Translator.setTranslations(json[lang], lang);
            }
            resolve();
        }).catch(function (ex) {
            console.warn("translations not loaded", ex);
            resolve(ex);
        });

    });
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
    var allDone;

    // load state from local storage
    var persistentStoreKeys = ['persistentUIState', 'preferences', 'favorites', 'betslip'];
    let storeLoaded = new Promise((resolve) => persistStore(store, {whitelist: persistentStoreKeys}, resolve));

    // load external config and merge with Config
    let configLoaded = new Promise(function (resolve) {
        console.log("loading config");
        var configUrl = location.hostname === "localhost" ? "/conf.local.json" : "/conf.json";
        fetch(configUrl).then(response => response.json()).then(function (json) {
            Helpers.mergeRecursive(Config, json);
            console.log("Merged config:", Config);
            resolve();
        }).catch(function (ex) {
            console.warn("external config not loaded", ex, ", proceeding with default one");
            resolve(ex);
        });
    });

    Promise.all([storeLoaded, configLoaded]).then(function () {
        //now we have our final config, we can initialize Zergling (Zergling uses some config values)
        initZergling(store);

        // Merge saved preferences from state with Config.env
        var state = store.getState();
        if (state && state.preferences) {
            Helpers.mergeRecursive(Config.env, state.preferences);
        }

        // Save Config.env to store
        Object.keys(Config.env).map(k => {
            store.dispatch(PreferencesSet(k, Config.env[k]));
        });

        console.log("store:", state, "config:", Config);

        allDone();
    });

    return new Promise(resolve => {
        allDone = resolve;
    });

}

