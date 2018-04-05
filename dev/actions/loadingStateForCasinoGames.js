import {
    CASINO_GAMES_AUTH_LOADING_DONE, CASINO_GAMES_AUTH_LOADING_FAILED,
    CASINO_GAMES_AUTH_LOADING_START
} from "./actionTypes/index";

/**
 * @description Start loading pool betting token
 * @returns {Object} new State
 */

export const loadingStart = (key) => ({type: CASINO_GAMES_AUTH_LOADING_START, key});

/**
 * @description Failed to load pool bet token
 * @param {Object} payload
 * @returns {Object} new State
 */
export const loadingFailed = (payload, key) => ({type: CASINO_GAMES_AUTH_LOADING_FAILED, key, payload});

/**
 * @description pool bet token is loaded
 * @param {Object} payload
 * @returns {Object} new State
 */
export const loadingDone = (payload, key) => ({type: CASINO_GAMES_AUTH_LOADING_DONE, key, payload});