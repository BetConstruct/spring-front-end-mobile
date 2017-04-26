import {STORE_HASH_PARAMS, UPDATE_HASH_PARAMS, RESET_HASH_PARAMS} from "./actionTypes/";

/**
 * @description Store hash params
 * @param {Object} payload
 * @returns {Object} new State
 */
export const StoreHashParams = (payload) => {
    return {
        type: STORE_HASH_PARAMS,
        payload
    };
};

/**
 * @description Reset hash params
 * @returns {Object} new State
 */
export const ResetHashParams = () => {
    return {
        type: RESET_HASH_PARAMS
    };
};

/**
 * @description Update hash params
 * @param {Object} payload
 * @returns {Object} new State
 */
export const UpdateHashParams = (payload) => {
    /**
     * @event updateHashParams
     */
    return {
        type: UPDATE_HASH_PARAMS,
        payload
    };
};