import {FAVORITE_ADD, FAVORITE_REMOVE, FAVORITES_CLEAR, SPORTS_FAVORITES_CLEAR, CASINO_FAVORITES_CLEAR, MARKET_FAVORITES_CLEAR} from './actionTypes/';

/**
 * Action to add corresponding object to favorites
 * @param {String} favType "game", "competition" , "marketType" or "casinoGame"
 * @param {String|Number} id
 * @param {*} payload optional. needed to store additional data for favorite id. if not provided, "true" will be stored
 * @returns {{type: *, favType: *, id: *, payload: *}}
 * @constructor
 */
export const FavoriteAdd = (favType, id, payload = null) => {
    return {
        type: FAVORITE_ADD,
        favType,
        id,
        payload
    };
};

/**
 * @description Remove Event from favorite
 * @param {String} favType
 * @param {Number} id
 * @returns {Object} new State
 */
export const FavoriteRemove = (favType, id) => { // favType is "game", "competition" , "marketType" or "casinoGame"
    return {
        type: FAVORITE_REMOVE,
        favType,
        id
    };
};

/**
 * @description Clear all Events from favorites
 * @returns {Object} new State
 */
export const FavoritesClear = () => {
    return {
        type: FAVORITES_CLEAR
    };
};

/**
 * @description Remove only sport events from favorites
 * @returns {Object} new State
 */
export const SportsFavoritesClear = () => {
    return {
        type: SPORTS_FAVORITES_CLEAR
    };
};

/**
 * @description Remove only casino events from favorites
 * @returns {Object} new State
 */
export const CasinoFavoritesClear = () => {
    return {
        type: CASINO_FAVORITES_CLEAR
    };
};

/**
 * @description Remove all Markets from favorites
 * @returns {Object} new State
 */
export const MarketFavoritesClear = () => {
    return {
        type: MARKET_FAVORITES_CLEAR
    };
};
