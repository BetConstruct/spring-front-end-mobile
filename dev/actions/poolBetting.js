import Zergling from '../helpers/zergling';
import {POOL_BETTING_TOKEN_LOADED, POOL_BETTING_TOKEN_LOADING, POOL_BETTING_TOKEN_FAILED} from "./actionTypes/index";

/**
 * @description Start loading pool betting token
 * @returns {Object} new State
 */
export const poolBetTokenLoadingStart = () => ({type: POOL_BETTING_TOKEN_LOADING});

/**
 * @description Failed to load pool bet token
 * @param {Object} payload
 * @returns {Object} new State
 */
export const poolBetTokenLoadingFailed = (payload) => ({type: POOL_BETTING_TOKEN_FAILED, payload});

/**
 * @description pool bet token is loaded
 * @param {Object} payload
 * @returns {Object} new State
 */
export const poolBetTokenLoadingDone = (payload) => ({type: POOL_BETTING_TOKEN_LOADED, payload});

/**
 * @description try to get poolbet AuthToken
 * @returns {Function} async action dispatcher
 */
export const getAuthToken = () => {
    return (dispatch) => {
        dispatch(poolBetTokenLoadingStart());
        Zergling.get({'game_id': 152000}, 'casino_auth').then(
            (data) => dispatch(poolBetTokenLoadingDone(data.result.token)),
            (data) => dispatch(poolBetTokenLoadingFailed(data))
        ).catch((ex) => {
            console.debug(ex);
        });
    };
};