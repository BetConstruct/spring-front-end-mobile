import {SWARM_DATA_BET_HISTORY_UNSETTLED_UPDATE_RECEIVED, SWARM_UPDATE_RECEIVED, SWARM_DATA_RECEIVED} from "../actions/actionTypes";
import {updateBetChashout} from "../helpers/sport/gameHelpers";
import {UpdateHistoryBets} from "../actions/betHistory";

/**
 * @name handleUpdate
 * @description Helper function to get and update bets
 * @param {function} state
 * @returns {object} updated bets
 * */
const processUpdate = (state, action, key) => state.swarmData.data[key].bets.map((bet) => {
    return {
        ...bet,
        ...updateBetChashout(bet, action.payload.event)
    };
});

/**
 * @name handleUpdate
 * @description Helper middleware function to catch updates and fire new event to process direct update
 * @param {function} store
 * @constructor
 * @fire event:UpdateHistoryBets
 * */
const handleUpdate = store => next => action => {
    if (action.key && typeof action.key.indexOf === "function" && action.key.indexOf('_CASHOUT_UPDATE_REACIVE') !== -1) {
        switch (action.type) {
            case SWARM_UPDATE_RECEIVED:
            case SWARM_DATA_RECEIVED: {
                let state = store.getState(),
                    betTypes = state.routing.locationBeforeTransitions.pathname.indexOf('open-bets') !== -1 ? 'betHistory_unsettled' : 'betHistory_settled',
                    updated = processUpdate(state, action, betTypes);
                store.dispatch(UpdateHistoryBets(updated, betTypes, SWARM_DATA_BET_HISTORY_UNSETTLED_UPDATE_RECEIVED));
            }
        }
    }
    return next(action);
};

export default handleUpdate;