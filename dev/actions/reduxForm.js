import {actionTypes as REDUX_FORM_ACTION_TYPES} from "redux-form";

/**
 * @description Change phone regional code
 * @param {Number} code
 * @param {String} formName
 * @param {String} fieldName
 * @param {String} pattern
 * @param {Boolean} touched
 * @param {Boolean} persistentSubmitErrors
 * @returns {Object} New state
 */
export const changePhoneCode = (code, formName, fieldName = "phone", pattern = undefined, touched = false, persistentSubmitErrors = false) => {
    return {
        type: REDUX_FORM_ACTION_TYPES.CHANGE,
        payload: {
            pattern,
            code,
            fullNumber: code
        },
        meta: {
            form: formName,
            field: fieldName,
            touched,
            persistentSubmitErrors
        }
    };
};

/**
 * @description Change transfer destination
 * @param {String} value
 * @param {String} formName
 * @param {String} fieldName
 * @param {Boolean} touched
 * @param {Boolean} persistentSubmitErrors
 * @returns {Object} New state
 */
export const changeTransferDestination = (value, formName, fieldName, touched = false, persistentSubmitErrors = false) => {
    return {
        type: REDUX_FORM_ACTION_TYPES.CHANGE,
        payload: value,
        meta: {
            form: formName,
            field: fieldName,
            touched,
            persistentSubmitErrors
        }
    };
};

