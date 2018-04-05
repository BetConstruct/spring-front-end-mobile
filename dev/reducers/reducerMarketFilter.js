import _ from "lodash";
import {SET_MARKET_GROUP_FILTER} from "../actions/actionTypes/";

const MarketGroupReducer = (state = {marketName: "all"}, action = {}) => {
    let ret = _.cloneDeep(state);
    switch (action.type) {
        case SET_MARKET_GROUP_FILTER:
            ret.marketName = action.payload;
            return ret;
        default:
            return state;
    }
};

export default MarketGroupReducer;