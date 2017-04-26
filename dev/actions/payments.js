import Zergling from '../helpers/zergling';
import {actionTypes as REDUX_FORM_ACTION_TYPES} from "redux-form";
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
    FILTERS_LOADING_START,
    FILTERS_LOADING_DONE,
    FILTERS_LOADING_FAILURE,
    UNSET_EXTERNAL_FORM_DATA} from './actionTypes/';

/**
 * @description  Start loading bet shops
 * @param {Boolean} payload
 * @returns {Object} new State
 */
export const betShopsLoadingStarted = (payload) => {
    return {
        type: BETSHOP_LOADING_START,
        payload
    };
};

/**
 * @description Start loading payments filter types
 * @returns {Object} new State
 */
export const filtersLoadingStarted = () => {
    return {
        type: FILTERS_LOADING_START,
        payload: true
    };
};

/**
 * @description  Done loading filter types
 * @param {Object} payload
 * @returns {Object} new State
 */
export const filtersLoadingDone = (payload) => {
    return {
        type: FILTERS_LOADING_DONE,
        payload
    };
};

/**
 * @description  Fail to load payment filter types
 * @param {Object} payload
 * @returns {Object} new State
 */
export const filtersLoadingFailure = (payload) => {
    return {
        type: FILTERS_LOADING_FAILURE,
        payload
    };
};

/**
 * @description Done loading bet shops
 * @param {Object} payload
 * @returns {Object} New state
 */
export const betShopsLoadingDone = (payload) => {
    return {
        type: BETSHOP_LOADING_DONE,
        payload
    };
};

/**
 * @description Fail to load bet shops
 * @param {Object} payload
 * @returns {Object} New state
 */
export const betShopsLoadingFailure = (payload) => {
    return {
        type: BETSHOP_LOADING_FAILURE,
        payload
    };
};

/**
 * @description Select payment method
 * @param {Object} payload
 * @returns {Object} New state
 */
export const SelectPaymentMethod = (payload) => {
    return {
        type: OPEN_PAYMENT_METHOD_FORM,
        payload
    };
};

/**
 * @description Deselect payment method
 * @param {*} payload
 * @returns {Object} New state
 */
export const DeselectPaymentMethod = (payload) => {
    return {
        type: CLOSE_PAYMENT_METHOD_FORM,
        payload
    };
};

/**
 * @description Set deposit next step data
 * @param {Object} payload
 * @returns {Object} New state
 */
export const SetDepositNextStep = (payload) => {
    return {
        type: SET_DEPOSIT_NEXT_STEP,
        payload
    };
};

/**
 * @description Unset deposit next step data
 * @param {Object} payload
 * @returns {Object} New state
 */
export const UnsetDepositNextStep = (payload) => {
    return {
        type: UNSET_DEPOSIT_NEXT_STEP,
        payload
    };
};

/**
 * @description  Select default amount
 * @param {String} value
 * @param {Object} meta
 * @returns {Object} New state
 */
export const SelectDefaultAmount = (value, meta) => {
    /**
     * @event selectDefaultAmount
     */
    return {
        type: REDUX_FORM_ACTION_TYPES.CHANGE,
        payload: value,
        meta
    };
};

/**
 * @description Set external form data to method
 * @param {Object} payload
 * @returns {Object} New state
 */
export const SetMethodExternalFormData = (payload) => {
    return {
        type: SET_EXTERNAL_FORM_DATA,
        payload
    };
};

/**
 * @description Set method confirm action
 * @param {Object} payload
 * @returns {Object} New state
 */
export const SetMethodConfirmAction = (payload) => {
    return {
        type: SET_METHOD_CONFIRM_ACTION,
        payload
    };
};

/**
 * @description Unset method confirm action
 * @returns {Object} New state
 */
export const UnsetMethodConfirmAction = () => {
    return {
        type: UNSET_METHOD_CONFIRM_ACTION
    };
};

/**
 * @description Unset method external form data
  * @returns {Object} New state
 */
export const UnsetMethodExternalFormData = () => {
    return {
        type: UNSET_EXTERNAL_FORM_DATA
    };
};

/**
 * @description Set method iframe data
 * @param {Object} payload
 * @returns {Object} New state
 */
export const SetMethodIframeData = (payload) => {
    return {
        type: SET_METHOD_IFRAME_DATA,
        payload
    };
};

/**
 * @description Unset method iframe data
 * @returns {Object} New state
 */
export const UnsetMethodIframeData = () => {
    return {
        type: UNSET_METHOD_IFRAME_DATA
    };
};

/**
 * @description Set method iframe data
 * @param {Object} requestData
 * @param {String} action
 * @returns {Function} async action dispatcher
 */
export const DoPaymentRequest = (requestData, action) => {
    return function (dispatch) {
        return Zergling.get(requestData, action).then(
            (response) => {
                return response;
            },
            (response) => {
                return response;
            }
        ).catch((response) => {
            return response;
        });
    };
};

/**
 * @description Load bet shops
 * @returns {Function} async action dispatcher
 */
export function LoadBetShops () {
    /**
     * @event loadBetShops
     */
    return function (dispatch) {
        dispatch(betShopsLoadingStarted(true));
        return Zergling
            .get({}, 'get_bet_shops')
            .then(
                (response) => {
                    dispatch(betShopsLoadingDone(response.result.cities));
                },
                (response) => {
                    dispatch(betShopsLoadingFailure({reason: response.reason}));
                }
            )
            .catch((data) => {
                dispatch(betShopsLoadingFailure({reason: data}));
            });
    };
}

/**
 * @description Load payment filters list
 * @returns {Function} async action dispatcher
 */
export function LoadFilters () {
    /**
     * @event loadFilters
     */
    return function (dispatch) {
        dispatch(filtersLoadingStarted());
        return Zergling
            .get({}, 'payment_services')
            .then(
                (response) => {
                    dispatch(filtersLoadingDone(response));
                },
                (response) => {
                    dispatch(filtersLoadingFailure({reason: response.reason}));
                }
            )
            .catch((data) => {
                dispatch(filtersLoadingFailure({reason: data}));
            });
    };
}
