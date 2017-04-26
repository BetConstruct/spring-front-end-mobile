import {SWARM_DATA_BET_HISTORY_UNSETTLED_UPDATE_RECEIVED, SWARM_UPDATE_RECEIVED, SWARM_DATA_RECEIVED} from "../actions/actionTypes";
import {updateBetChashout} from "../helpers/sport/gameHelpers";

const processUpdate = (state, action, key) => state.swarmData.data[key].bets.map((bet) => {
    return {
        ...bet,
        ...updateBetChashout(bet, action.payload.event)
    };
});

const handleUpdate = store => next => action => {
    if (action.key && action.key.indexOf('_CASHOUT_UPDATE_REACIVE') !== -1) {
        switch (action.type) {
            case SWARM_UPDATE_RECEIVED:
            case SWARM_DATA_RECEIVED: {
                let state = store.getState(),
                    betTypes = state.routing.locationBeforeTransitions.pathname.indexOf('open-bets') !== -1 ? 'betHistory_unsettled' : 'betHistory_settled',
                    updated = processUpdate(state, action, betTypes);
                store.dispatch({
                    type: SWARM_DATA_BET_HISTORY_UNSETTLED_UPDATE_RECEIVED,
                    payload: {
                        bets: updated
                    },
                    meta: {
                        betTypes
                    }
                });
            }
        }
    }
    return next(action);
};

export default handleUpdate;