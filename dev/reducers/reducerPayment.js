import {
    BETSHOP_LOADING_DONE,
    BETSHOP_LOADING_START,
    BETSHOP_LOADING_FAILURE,
    OPEN_PAYMENT_METHOD_FORM,
    CLOSE_PAYMENT_METHOD_FORM,
    SET_EXTERNAL_FORM_DATA,
    SET_METHOD_IFRAME_DATA,
    UNSET_METHOD_IFRAME_DATA,
    SET_METHOD_CONFIRM_ACTION,
    UNSET_METHOD_CONFIRM_ACTION,
    SET_DEPOSIT_NEXT_STEP,
    UNSET_DEPOSIT_NEXT_STEP,
    UNSET_EXTERNAL_FORM_DATA,
    FILTERS_LOADING_START,
    FILTERS_LOADING_DONE,
    FILTERS_LOADING_FAILURE,
    WITHDRAWALS_LOADING_START,
    WITHDRAWALS_LOADING_DONE,
    WITHDRAWALS_LOADING_FAILURE,
    GET_BUDDY_TO_BUDDY_FRIEND_LIST
} from "../actions/actionTypes/";

const setLoadingState = (loading = false, loaded = false, failed = false) => ({
    loaded,
    loading,
    failed
});

const PaymentReducer = (state = {data: {loaded: false, loading: false}, buddyToBuddy: {}, availableMethods: [], filters: {loaded: false, loading: false, data: {}}, withdrawals: setLoadingState()}, action = {}) => {

    switch (action.type) {
        case FILTERS_LOADING_DONE:
            return Object.assign({}, state, {filters: {...setLoadingState(false, true), data: action.payload}});
        case FILTERS_LOADING_START:
            return Object.assign({}, state, {data: setLoadingState(true)});
        case FILTERS_LOADING_FAILURE:
            return Object.assign({}, state, {data: setLoadingState(false, false, true)});
        case BETSHOP_LOADING_DONE:
            return Object.assign({}, state, {data: {...setLoadingState(false, true), cities: action.payload}});
        case BETSHOP_LOADING_START:
            return Object.assign({}, state, {data: setLoadingState(true)});
        case BETSHOP_LOADING_FAILURE:
            return Object.assign({}, state, {data: setLoadingState(false, false, true)});
        case OPEN_PAYMENT_METHOD_FORM:
            return Object.assign({}, state, {method: action.payload});
        case CLOSE_PAYMENT_METHOD_FORM:
            return Object.assign({}, state, {method: undefined, iframe: undefined, hiddenForm: undefined, confirmAction: undefined});
        case SET_EXTERNAL_FORM_DATA:
            return Object.assign({}, state, {hiddenForm: action.payload});
        case UNSET_EXTERNAL_FORM_DATA:
            return Object.assign({}, state, {hiddenForm: undefined});
        case SET_METHOD_IFRAME_DATA:
            return Object.assign({}, state, {iframe: action.payload});
        case UNSET_METHOD_IFRAME_DATA:
            return Object.assign({}, state, {iframe: undefined});
        case SET_METHOD_CONFIRM_ACTION:
            return Object.assign({}, state, {confirmAction: action.payload});
        case UNSET_METHOD_CONFIRM_ACTION:
            return Object.assign({}, state, {confirmAction: undefined});
        case SET_DEPOSIT_NEXT_STEP:
            return Object.assign({}, state, {nextStep: action.payload});
        case UNSET_DEPOSIT_NEXT_STEP:
            return Object.assign({}, state, {nextStep: undefined});
        case GET_BUDDY_TO_BUDDY_FRIEND_LIST:
            return {
                ...state,
                buddyToBuddy: {
                    list: action.payload
                }
            };
        case WITHDRAWALS_LOADING_START:
            return {...state, withdrawals: setLoadingState(true)
            };
        case WITHDRAWALS_LOADING_DONE: {
            let withdrawals = {
                ...setLoadingState(false, true),
                data: action.payload
            };
            return {...state, withdrawals};
        }
        case WITHDRAWALS_LOADING_FAILURE:
            return {...state, withdrawals: setLoadingState(false, false, true)};
        default:
            return state;
    }
};

export default PaymentReducer;