import Zergling from '../helpers/zergling';
import Config from "../config/main";

import {SWARM_CONFIG_DATA} from './actionTypes/';

/**
 * @description Set partner initial configs
 * @param {Object} message
 * @param {String} key
 * @returns {Object} new State
 */
export const SwarmConfigData = (message, key) => {
    return {
        type: SWARM_CONFIG_DATA,
        payload: message,
        key
    };
};

/**
 * @description Load additional partner configs
 * @returns {Function} async action dispatcher
 */
export function LoadPartnerConfig () {
    return function (dispatch) {
        let updatePartnerConfig = (data) => {
            console.log("partner config:", data);
            dispatch(SwarmConfigData(data.partner[Config.main.site_id], "partner"));
        };
        return Zergling
            .subscribe({"source": "partner.config", 'what': {'partner': []}}, updatePartnerConfig)
            .then(response => updatePartnerConfig(response.data))
            .catch((ex) => {
                console.error("partner config load failed:", ex);
            });
    };
}

/**
 * @description Load partner currency configs
 * @returns {Function} async action dispatcher
 */
export function LoadCurrencyConfig () {
    return function (dispatch) {
        let updateCurrencyConfig = (data) => {
            console.log("currency config:", data);
            let currencies = {};
            Object.keys(data.currency).map(id => { currencies[data.currency[id].name] = data.currency[id]; });
            dispatch(SwarmConfigData(currencies, "currency"));
        };
        return Zergling
            .subscribe({
                'source': 'config.currency',
                'what': {'currency': []},
                'where': {'currency': {'name': {"@in": Config.main.availableCurrencies}}
                }
            }, updateCurrencyConfig)
            .then(response => updateCurrencyConfig(response.data))
            .catch((ex) => {
                console.error("CurrencyConfig load failed:", ex);
            });
    };
}