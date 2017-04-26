import _ from "lodash";
import {SWARM_CONFIG_DATA} from "../actions/actionTypes/";

const SwarmConfigDataReducer = (state = {}, action = {}) => {
    var ret = _.cloneDeep(state);
    switch (action.type) {
        case SWARM_CONFIG_DATA:
            ret[action.key] = action.payload;
            return ret;
        default :
            return state;
    }
};

export default SwarmConfigDataReducer;