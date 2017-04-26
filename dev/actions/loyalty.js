import Zergling from '../helpers/zergling';
import {SwarmLoadingStart, SwarmLoadingDone, SwarmReceiveData} from "./swarm";
import {UILoading, UILoadingDone, UILoadingFailed} from "./ui"; //or maybe use redux-form status actions instead
import {t} from "../helpers/translator";

/**
 * @description Load loyalty Levels
 * @returns {Function} async action dispatcher
 */
export function LoadLoyaltyLevels () {
    let swarmDataKey = "loyalty_levels";
    return function (dispatch) {
        dispatch(SwarmLoadingStart(swarmDataKey));
        return Zergling
            .get({}, 'get_loyalty_levels')
            .then((response) => {
                dispatch(SwarmReceiveData(response, swarmDataKey));
            })
            .catch((reason) => {
                console.warn("error loading " + swarmDataKey, reason);
            })
            .then(() => dispatch(SwarmLoadingDone(swarmDataKey)));
    };
}

/**
 * @description Load loyalty Rates
 * @returns {Function} async action dispatcher
 */
export function LoadLoyaltyRates () {
    let swarmDataKey = "loyalty_rates";
    return function (dispatch) {
        dispatch(SwarmLoadingStart(swarmDataKey));
        return Zergling
            .get({}, 'get_loyalty_rates')
            .then((response) => {
                dispatch(SwarmReceiveData(response, swarmDataKey));
            })
            .catch((reason) => {
                console.warn("error loading " + swarmDataKey, reason);
            })
            .then(() => dispatch(SwarmLoadingDone(swarmDataKey)));
    };
}

/**
 * @description Exchange Loyalty Points
 * @param {Number} amount
 * @returns {Function} async action dispatcher
 */
export function ExchangeLoyaltyPoints (amount) {
    let key = "ExchangeLoyaltyPoints";
    return function (dispatch) {
        dispatch(UILoading(key));
        Zergling
            .get({'points': amount}, 'bonus_exchange_points')
            .then(function (response) {
                if (response.code === 0) {
                    dispatch(UILoadingDone(key));
                } else if (response.code === 2417) {
                    dispatch(UILoadingFailed(key, t('Entered amount is out of allowable range.')));
                } else if (response.code === 2084) {
                    dispatch(UILoadingFailed(key, t('Transaction amount error.')));
                }
            },
            function (response) {
                console.log('error:', response);
            }
        ).catch((reason) => {
            console.warn("error loading " + key, reason);
        });

    };
}