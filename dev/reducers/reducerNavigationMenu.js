import {POOL_BETTING_TOKEN_LOADED, POOL_BETTING_TOKEN_LOADING, POOL_BETTING_TOKEN_FAILED} from "../actions/actionTypes/";

const setLoadingState = (data = null, loaded = false, loading = false, failed = false) => ({loaded, loading, failed, data});

const NavigationMenuReducer = (state = {poolBet: setLoadingState()}, action) => {
    switch (action.type) {
        case POOL_BETTING_TOKEN_LOADING:
            return {
                ...state,
                poolBet: {
                    ...state.poolBet,
                    ...setLoadingState(false, false, true, false)
                }
            };
        case POOL_BETTING_TOKEN_LOADED:
            return {
                ...state,
                poolBet: {
                    ...state.poolBet,
                    ...setLoadingState(action.payload, true)
                }
            };
        case POOL_BETTING_TOKEN_FAILED:
            return {
                ...state,
                poolBet: {
                    ...state.poolBet,
                    ...setLoadingState(action.payload, false, false, true)
                }
            };
        default :
            return state;
    }
};

export default NavigationMenuReducer;