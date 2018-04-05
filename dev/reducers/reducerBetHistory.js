/**
 * Created by varduhi.vardanyan on 7/21/2017.
 */
import {SET_CASH_OUT_VALUE} from "../actions/actionTypes/";

const BetHistoryReducer = (state = {cashout: {}}, action = {}) => {
    switch (action.type) {
        case SET_CASH_OUT_VALUE:
            return {
                ...state,
                cashout: {
                    ...state.cashout,
                    ...action.payload
                }
            };
        default :
            return state;
    }
};

export default BetHistoryReducer;