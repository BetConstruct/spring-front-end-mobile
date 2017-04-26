import {
    BETSHOP_LOADING_DONE,
    BETSHOP_LOADING_START,
    BETSHOP_LOADING_FAILURE,
    OPEN_PAYMENT_METHOD_FORM,
    CLOSE_PAYMENT_METHOD_FORM,
    FILTER_PAYMENTS_FOR_USER_CURRENCY,
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
    FILTERS_LOADING_FAILURE
} from "../actions/actionTypes/";

const PaymentReducer = (state = {data: {loaded: false, loading: false}, availableMethods: [], filters: {loaded: false, loading: false, data: {}}}, action = {}) => {

    switch (action.type) {
        case FILTERS_LOADING_DONE:
            return Object.assign({}, state, {
                filters: {
                    loading: false,
                    loaded: true,
                    failed: false,
                    data: action.payload
                }
            });
        case FILTERS_LOADING_START:
            return Object.assign({}, state, {data: {loading: true}});
        case FILTERS_LOADING_FAILURE:
            return Object.assign({}, state, {data: {loading: false, loaded: false, failed: true}});
        case BETSHOP_LOADING_DONE:
            return Object.assign({}, state, {
                data: {
                    loading: false,
                    loaded: true,
                    failed: false,
                    cities: action.payload
                }
            });
        case BETSHOP_LOADING_START:
            return Object.assign({}, state, {data: {loading: true}});
        case BETSHOP_LOADING_FAILURE:
            return Object.assign({}, state, {data: {loading: false, loaded: false, failed: true}});
        case OPEN_PAYMENT_METHOD_FORM:
            return Object.assign({}, state, {method: action.payload});
        case CLOSE_PAYMENT_METHOD_FORM:
            return Object.assign({}, state, {
                method: undefined,
                iframe: undefined,
                hiddenForm: undefined,
                confirmAction: undefined
            });
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
        default:
            return state;
    }
};

export default PaymentReducer;