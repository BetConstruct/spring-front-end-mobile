import {SET_BET_HISTORY_FILTERS, RESET_BET_HISTORY_FILTERS} from "../actions/actionTypes/";
import {predefinedDateRanges} from "../constants/balanceHistory";
let initial = {
    from_date: predefinedDateRanges[0].fromDate,
    to_date: predefinedDateRanges[0].toDate,
    range: "0"
};
const BetHistoryFiltersReducer = (state = initial, action = {}) => {
    switch (action.type) {
        case SET_BET_HISTORY_FILTERS:
            return {
                ...state,
                ...action.payload
            };
        case RESET_BET_HISTORY_FILTERS:
            return initial;
        default :
            return state;
    }
};

export default BetHistoryFiltersReducer;