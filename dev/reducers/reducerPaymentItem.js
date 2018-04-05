import {
    ACTIVE_MESSAGES_FOR_PAYMENT_METHOD_LOADING_DONE, ACTIVE_MESSAGES_FOR_PAYMENT_METHOD_LOADING_FAIL,
    ACTIVE_MESSAGES_FOR_PAYMENT_METHOD_LOADING_START, CREATE_MESSAGES_FOR_PAYMENT_METHOD_DONE,
    CREATE_MESSAGES_FOR_PAYMENT_METHOD_FAIL,
    CREATE_MESSAGES_FOR_PAYMENT_METHOD_START
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

const PaymentItemsStateReducer = (state = {loaded: {}, loading: {}, data: {}}, action) => {
    switch (action.type) {
        case ACTIVE_MESSAGES_FOR_PAYMENT_METHOD_LOADING_START:
            return getCurrentState(state, action, true, false, null);
        case ACTIVE_MESSAGES_FOR_PAYMENT_METHOD_LOADING_DONE:
            return getCurrentState(state, action, false, true, action.payload);
        case ACTIVE_MESSAGES_FOR_PAYMENT_METHOD_LOADING_FAIL:
            return getCurrentState(state, action, false, false, null);
        case CREATE_MESSAGES_FOR_PAYMENT_METHOD_START:
            return getCurrentState(state, action, true, false, null);
        case CREATE_MESSAGES_FOR_PAYMENT_METHOD_DONE:
            return getCurrentState(state, action, false, true, action.payload);
        case CREATE_MESSAGES_FOR_PAYMENT_METHOD_FAIL:
            return getCurrentState(state, action, false, false, null);
        default :
            return state;
    }
};

export default PaymentItemsStateReducer;