import _ from "lodash";
import {
    SWARM_LOADING_START,
    SWARM_LOADING_DONE,
    SWARM_DATA_RECEIVED,
    SWARM_CLEAR_DATA,
    SWARM_UPDATE_RECEIVED,
    CONNECTED,
    DISCONNECTED,
    SWARM_DELETE_NESTED_DATA,
    SWARM_DATA_BET_HISTORY_UNSETTLED_UPDATE_RECEIVED,
    DESTROY_LOADED_BET_HISTORY
} from "../actions/actionTypes/";
import Helpers from "../helpers/helperFunctions";

const SwarmDataReducer = (state = {data: {}, loaded: {}, connected: false, useWebSocket: false}, action = {}) => {
    var ret = Object.assign({}, state);
    switch (action.type) {
        case SWARM_LOADING_START:
            ret.loaded[action.key] = false;
            return ret;
        case SWARM_LOADING_DONE:
            ret.loaded[action.key] = true;
            return ret;
        case SWARM_DATA_RECEIVED:
            ret.data[action.key] = _.cloneDeep(action.payload);
            return ret;
        case SWARM_CLEAR_DATA:
            delete ret.loaded[action.key];
            delete ret.data[action.key];
            return ret;
        case DESTROY_LOADED_BET_HISTORY:
            delete ret.loaded.betHistory_unsettled;
            delete ret.loaded.betHistory_settled;
            return ret;
        case SWARM_UPDATE_RECEIVED:
            ret.data[action.key] = _.cloneDeep(action.payload);
            return ret;
        case SWARM_DATA_BET_HISTORY_UNSETTLED_UPDATE_RECEIVED:
            ret.data[action.meta.betTypes].bets = _.cloneDeep(action.payload.bets);
            return ret;
        case SWARM_DELETE_NESTED_DATA:
            ret.data = _.cloneDeep(ret.data);
            Helpers.removeMatchingPartFromObject(ret.data, action.path, action.fieldName, action.value);
            return ret;
        case CONNECTED:
            return Object.assign({}, state, action.payload);
        case DISCONNECTED:
            return Object.assign({}, state, action.payload);
        default :
            return state;
    }
};

export default SwarmDataReducer;