import Zergling from '../helpers/zergling';
import {SwarmLoadingStart, SwarmLoadingDone, SwarmReceiveData, SwarmClearData} from './swarm';
import {SET_BET_HISTORY_FILTERS, RESET_BET_HISTORY_FILTERS, DESTROY_LOADED_BET_HISTORY} from "../actions/actionTypes/";

/**
 * @name LoadBetHistory
 * @description  Load Bets history for given product and date range;
 * @param {Boolean} unsettled
 * @param {Object} options
 * @returns {Function} async action dispatcher
 */
export function LoadBetHistory (unsettled = false, options = {}) {
    let swarmDataKey = "betHistory" + (unsettled ? "_unsettled" : "_settled"),
        {from_date, to_date, time_shift, product} = options,
        request = {
            where: {
                with_pool_bets: true,
                from_date,
                to_date,
                time_shift
            },
            product
        };
    if (unsettled) {
        request.where.outcome = 0;
    }

    return function (dispatch) {
        dispatch(SwarmLoadingStart(swarmDataKey));
        Zergling
            .get(request, "bet_history")
            .then(response => {
                dispatch(SwarmReceiveData(response, swarmDataKey));
            })
            .catch()
            .then(() => dispatch(SwarmLoadingDone(swarmDataKey)));
    };
}

/**
 * @name SetBetHistoryFilters
 * @description Append Bet History filters data;
 * @param {Object} payload
 * @returns {Object}
 */
export function SetBetHistoryFilters (payload) {
    return {
        type: SET_BET_HISTORY_FILTERS,
        payload
    };
}

/**
 * @name ResetBetHistoryFiltersToDefault
 * @description Reset bet history filters to default
 * @returns {Object}
 */
export function ResetBetHistoryFiltersToDefault () {
    return {
        type: RESET_BET_HISTORY_FILTERS
    };
}

/**
 * @name ResetLoadedBetHistory
 * @description Reset loaded bet history filters
 * @returns {Object}
 */
export function ResetLoadedBetHistory () {
    return {
        type: DESTROY_LOADED_BET_HISTORY
    };
}

/**
 * @name DoCashOut
 * @description Do cash out for given betId and price
 * @param {Number} betId
 * @param {Number} price
 * @returns {Function} async action dispatcher
 */
export function DoCashOut (betId, price) {
    var swarmDataKey = "cashOut";

    return function (dispatch) {
        dispatch(SwarmClearData(swarmDataKey));
        dispatch(SwarmLoadingStart(swarmDataKey));
        Zergling
            .get({bet_id: betId, price}, 'cashout')
            .then(response => {
                dispatch(SwarmReceiveData(response, swarmDataKey));
            })
            .catch()
            .then(() => dispatch(SwarmLoadingDone(swarmDataKey)));
    };
}
