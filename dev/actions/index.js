import {APP_READY, PREFERENCES_SET, PREFERENCES_RESET} from './actionTypes/';

/**
 * @description App was ready
 * @returns {Object} new State
 */
export const AppReady = () => {
    return {
        type: APP_READY
    };
};

/**
 * @description Set site preferances
 * @param {String} key
 * @param {*} value
 * @returns {Object} new State
 */
export const PreferencesSet = (key, value) => {
    return {
        type: PREFERENCES_SET,
        key,
        value
    };
};

/**
 * @description Reset site preferences
 * @returns {Object} new State
 */
export const PreferencesReset = () => {
    return {
        type: PREFERENCES_RESET
    };
};
