/**  Actions for managing user dataa  */
import Zergling from '../helpers/zergling';
import Config from "../config/main";
import {t} from "../helpers/translator";
import {UILoading, UILoadingDone, UILoadingFailed, OpenPopup} from "./ui";
import {startSubmit, stopSubmit} from 'redux-form';
import formsNames from "../constants/formsNames";
import {USER_PROFILE_UPDATE_RECEIVED} from './actionTypes/';
import {Logout, LoggedOut} from './login';
import {SET_REGISTRATION_ACTIVE_STEP, UPDATE_MESSAGES_UNREAD_COUNT, UPDATE_USER_PROFILE} from "./actionTypes/index";

/**
 * @description Sync action creator
 * @param data profile data(full, not just the diff)
 * @returns {{type, payload: *}} action object
 */
export const UserProfileUpdateReceived = (data) => {
    return {
        type: USER_PROFILE_UPDATE_RECEIVED,
        payload: data
    };
};
/**
 * @description Async action creator for changing user password.
 * @param {String} currentPass current password
 * @param {String} newPass new password
 * @param {String} formName redux form name (to reflect state changes)
 * @returns {Function} function to be executed by redux thunk middleware
 */
export function ChangePassword (currentPass, newPass, formName) {
    return function (dispatch) {
        dispatch(UILoading(formName));
        dispatch(startSubmit(formName));
        return Zergling
            .get({password: currentPass, new_password: newPass}, 'update_user_password')
            .then((response) => {
                response.result === 0
                ? dispatch(UILoadingDone(formName))
                : dispatch(UILoadingFailed(formName, response));
                dispatch(stopSubmit(formName));
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(formName, reason));
                dispatch(stopSubmit(formName, {reason: reason}));
            });
    };
}
/**
 * @description Async action creator for uploading user docs.
 * @param {String} data encoded image data
 * @returns {Function} function to be executed by redux thunk middleware
 */
export function UploadDocument (data) {
    return function (dispatch) {
        dispatch(UILoading(formsNames.uploadDocumentForm));
        return Zergling
            .get({image_data: data}, 'upload_image')
            .then((response) => {
                response.result === 0
                    ? dispatch(UILoadingDone(formsNames.uploadDocumentForm))
                    : dispatch(UILoadingFailed(formsNames.uploadDocumentForm, response));
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(formsNames.uploadDocumentForm, reason));
            });
    };
}
/**
 * @description Async action creator for updating user profile data.
 * @param {Object} userData profile data object
 * @param {String} formName redux form name (to reflect state changes)
 * @returns {Function} function to be executed by redux thunk middleware
 */
export function UpdateProfile (userData, formName) {
    return function (dispatch) {
        dispatch(UILoading(formsNames.profileDetailsForm));
        dispatch(startSubmit(formName));
        return Zergling
            .get({user_info: userData}, 'update_user')
            .then((response) => {
                console.log("updateProfile response", response);
                if (response.result === 0) {
                    dispatch(UILoadingDone(formsNames.profileDetailsForm));
                    dispatch(stopSubmit(formName));
                } else {
                    dispatch(UILoadingFailed(formsNames.profileDetailsForm, response.result));
                    dispatch(stopSubmit(formName, {reason: response.result}));
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(formsNames.profileDetailsForm, reason));
                dispatch(stopSubmit(formName, {reason}));
            });
    };
}
/**
 * Sets deposit limits or self exclusion
 * @param {String} type "deposit"  or  "self-exclusion"
 * @param {Object} limits limits data object
 * @param {String} formName redux form name (to reflect state changes)
 * @returns {Function}
 */
export function SetUserLimits (type, limits, formName) {
    let limitValues = {
        "1-year": {years: 1},
        "2-year": {years: 2},
        "5-year": {years: 5},
        "6-month": {months: 6},
        "3-month": {months: 3},
        "2-month": {months: 2},
        "1-month": {months: 1},
        "7-day": {days: 7},
        "1-day": {days: 1},
        "forever": {years: 10}
    };
    let command = 'set_client_self_exclusion';
    let request = limitValues[limits.period];

    switch (true) {
        case type === "self-exclusion" && !!Config.main.selfExclusionByExcType:
            request.exc_type = Config.main.selfExclusionByExcType;
            break;
        case type === "timeout-limits" && !!Config.main.userTimeOut && Config.main.userTimeOut.type === 6:
            request.exc_type = Config.main.userTimeOut.type;
            break;
        case type === "reality-checks":
            request = {
                active_time: parseFloat(limits)
            };
            command = "update_user_active_time";
            break;
        case type === "deposit-limits":
            request = {
                limits: limits.values,
                type: "deposit"
            };
            command = "set_user_limits";
            break;
    }
    return function (dispatch) {
        dispatch(startSubmit(formName));
        dispatch(UILoading(formName));
        return Zergling
            .get(request, command)
            .then((response) => {
                if (response.result === 0 || response.result === "OK") {
                    dispatch(stopSubmit(formName));
                    dispatch(UILoadingDone(formName));

                    switch (type) {
                        case "self-exclusion":
                            dispatch(OpenPopup("message", {title: t("Self exclusion"), type: "info", body: t("Now you are self excluded and will be logged out.")}));
                            dispatch(Logout());
                            dispatch(LoggedOut());
                            break;
                        case "timeout-limits":
                            dispatch(OpenPopup("message", {title: t("Success"), type: "accept", body: t("Time-Out period set.")}));
                            break;
                        case "reality-checks":
                            dispatch(OpenPopup("message", {title: t("Success"), type: "accept", body: t("Your Reality Check settings have been updated.")}));
                            break;
                        case "deposit-limits":
                            dispatch(OpenPopup("message", {title: t("Success"), type: "accept", body: t("Time-Out period set.")}));
                            break;
                    }
                } else {
                    dispatch(UILoadingFailed(formName, response.result));
                    dispatch(stopSubmit(formName, {reason: response.result}));
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(formName, reason));
                dispatch(stopSubmit(formName, {reason}));
            });
    };
}
/**
 * @description Async action creator for resetting user password.
 * @param {String} email email to send password to
 * @returns {Function} function to be executed by redux thunk middleware
 */
export function ResetPassword (email) {
    return function (dispatch) {
        dispatch(UILoading(formsNames.resetPasswordForm));
        return Zergling
            .get({email}, 'forgot_password')
            .then((response) => {
                if (response.result === 0) {
                    dispatch(UILoadingDone(formsNames.resetPasswordForm));
                } else {
                    throw response; //forgot_password command returns success code even when resetting fails
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(formsNames.resetPasswordForm, reason));
            });
    };
}
/**
 * @description Async action creator for resetting user password.
 * @param {String} password new password
 * @param {String} code password reset code
 * @returns {Function} function to be executed by redux thunk middleware
 */
export function ChangeForgottenPassword (password, code) {
    return function (dispatch) {
        dispatch(UILoading(formsNames.changeForgottenPasswordForm));
        return Zergling
            .get({new_password: password, reset_code: code}, 'reset_password')
            .then(
                function (response) {
                    if (response.result === 0) {
                        dispatch(UILoadingDone(formsNames.changeForgottenPasswordForm));
                        //$scope.message = Translator.get('Invalid email');
                    } else {
                        dispatch(UILoadingFailed(formsNames.changeForgottenPasswordForm, response.result));
                    }
                },
                function (failResponse) {
                    dispatch(UILoadingFailed(formsNames.changeForgottenPasswordForm, failResponse.result));
                }
            )
            .catch((reason) => {
                dispatch(UILoadingFailed(formsNames.changeForgottenPasswordForm, reason));
            });
    };
}

export function updateUserProfile (payload) {
    return {
        type: UPDATE_USER_PROFILE,
        payload
    };
}

export function VerifyUserByEmail ({successCallback, errorCallback, params}) {
    return Zergling.get({ "verification_code": params.code }, 'verify_user').then(function (response) {
        if (response.result === 0) {
            successCallback && successCallback();
        } else {
            errorCallback && errorCallback();
        }
    });
}

export const UpdateMessagesUnreadCount = (payload) => {
    return {
        type: UPDATE_MESSAGES_UNREAD_COUNT,
        payload
    };
};

export const SetRegistrationState = (payload, meta) => ({type: SET_REGISTRATION_ACTIVE_STEP, payload, meta});

export const SubscribeForMessages = (callback) => (dispatch) => {
    Zergling
        .subscribe({'source': 'messages', 'what': {'messages': []}, 'subscribe': true}, () => {
            dispatch(UpdateMessagesUnreadCount(1));
        })
        .then((result) => {
            callback && callback(() => Zergling.unsubscribe([result.subid]).catch((ex) => console.error("cannot unsubscribe:", ex)));
        });
};