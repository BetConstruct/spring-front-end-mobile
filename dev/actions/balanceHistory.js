import Zergling from '../helpers/zergling';
import {SwarmLoadingStart, SwarmLoadingDone, SwarmReceiveData} from './swarm';

/**
 * @name LoadBalanceHistory
 * @description  Load balance history for given product and date range;
 * @param {String} product name "Sport, Casino ..."
 * @param {Object} dateRange
 * @param {Number} type
 * @returns {Function} async action dispatcher
 */

export function LoadBalanceHistory (product, dateRange, type) {
    var swarmDataKey = "balanceHistory";

    let timeZoneOffset = new Date().getTimezoneOffset() / 60,
        where = {time_shift: -timeZoneOffset},
        balanceType = parseInt(type, 10);

    where.from_date = dateRange.fromDate.unix();
    where.to_date = dateRange.toDate.unix();

    if (balanceType !== -1) { // -1 means "all"
        where.type = balanceType;
    }
    let request = {where, product: product || undefined};

    return function (dispatch) {
        dispatch(SwarmLoadingStart(swarmDataKey));
        Zergling
            .get(request, "balance_history")
            .then(response => {
                dispatch(SwarmReceiveData(response, swarmDataKey));
            })
            .catch()
            .then(() => dispatch(SwarmLoadingDone(swarmDataKey)));
    };
}
