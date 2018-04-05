import {
    CASINO_GAMES_AUTH_LOADING_DONE, CASINO_GAMES_AUTH_LOADING_FAILED,
    CASINO_GAMES_AUTH_LOADING_START
} from "../actions/actionTypes/index";
const addValue = (key, value) => {
    let obj = {};
    obj[key] = value;
    return obj;
};

const getCurrentState = (state, action, loading, loaded, data) => ({
    ...state,
    loading: {
        ...state.loading,
        ...addValue(action.key, loading)
    },
    loaded: {
        ...state.loaded,
        ...addValue(action.key, loaded)
    },
    data: {
        ...state.data,
        ...addValue(action.key, data)
    }
});

const NavigationMenuReducer = (state = {loaded: {}, loading: {}, data: {}}, action) => {
    switch (action.type) {
        case CASINO_GAMES_AUTH_LOADING_START:
            return getCurrentState(state, action, true, false, null);
        case CASINO_GAMES_AUTH_LOADING_DONE:
            return getCurrentState(state, action, false, true, action.payload);
        case CASINO_GAMES_AUTH_LOADING_FAILED:
            return getCurrentState(state, action, false, false, null);
        default :
            return state;
    }
};

export default NavigationMenuReducer;