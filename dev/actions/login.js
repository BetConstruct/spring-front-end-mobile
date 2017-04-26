import Zergling from '../helpers/zergling';
import cookie from 'react-cookie';
import Config from "../config/main";
import {UILoading, UILoadingDone, UILoadingFailed} from "./ui";
import {startSubmit, stopSubmit} from 'redux-form';

import {REALLY_LOGGED_IN, LOGGED_IN, LOGGED_OUT, LOGIN_START, LOGIN_FAILED, CAPTCH_LOAD_SUCCESS, CAPTCH_LOAD_FAILURE} from './actionTypes/';

/**
 * @description User Logged in state
 * @param {Object} message
 * @returns {Object} new State
 */
export const LoggedIn = (message) => {
    return {
        type: LOGGED_IN,
        payload: message
    };
};

/**
 * @description Login status check result
 * @param {Boolean} message
 * @returns {Object} new State
 */
export const ReallyLoggedIn = (message) => {
    return {
        type: REALLY_LOGGED_IN,
        payload: message
    };
};

/**
 * @description Logout confirmation
 * @param {Object} message
 * @returns {Object} new State
 */
export const LoggedOut = (message) => {
    return {
        type: LOGGED_OUT,
        payload: message
    };
};

/**
 * @description Start login process
 * @param {Object} message
 * @returns {Object} new State
 */
export const LoginStart = (message) => {
    return {
        type: LOGIN_START,
        payload: message
    };
};

/**
 * @description User Logged Failed
 * @param {Object} message
 * @returns {Object} new State
 */
export const LoginFailed = (message) => {
    return {
        type: LOGIN_FAILED,
        payload: message
    };
};

/**
 * @description User Logged in state
 * @param {Object} payload
 * @returns {Object} new State
 */
export const loadCaptchaSuccess = (payload) => {
    return {
        type: CAPTCH_LOAD_SUCCESS,
        payload
    };
};

/**
 * @description Fail to load captcha
 * @param {Object} payload
 * @returns {Object} new State
 */
export const loadCaptchaFailure = (payload) => {
    return {
        type: CAPTCH_LOAD_FAILURE,
        payload
    };
};

/**
 * @description User login
 * @param {String} username
 * @param {String} password
 * @param {Boolean} remember
 * @returns {Function} async action dispatcher
 */
export function Login (username, password, remember) {
    return function (dispatch) {
        return Zergling
            .login({username, password})
            .then((response) => {
                if (remember) {
                    cookie.save('authData', response.data, {path: '/', expires: new Date(Date.now() + Config.main.authSessionLifeTime * 1000)});
                } else {
                    response.data.prolongLessTime = true;
                    cookie.save('authData', response.data, {path: '/', expires: new Date(Date.now() + Config.main.authSessionLessLifeTime * 1000)});
                }
            })
            .catch((data) => { dispatch(LoginFailed(data)); });
    };
}

/**
 * @description Logout user
 * @returns {Function} async action dispatcher
 */
export function Logout () {
    return function (dispatch) {
        cookie.remove('authData', { path: '/' });
        return Zergling.logout();
    };
}

/**
 * @description Restore login
 * @param {Object} authData
 * @returns {Function} async action dispatcher
 */
export function RestoreLogin (authData) {
    return function (dispatch) {
        dispatch(UILoading("restoreLogin"));
        Zergling.setAuthData(authData);
        return Zergling
            .login(null)
            .then(() => { dispatch(UILoadingDone("restoreLogin")); })
            .catch((data) => {
                dispatch(UILoadingFailed("restoreLogin"));
                dispatch(LoginFailed(data));
                console.error(data);
            });
    };
}

/**
 * @description Register new user
 * @param {Object} regInfo
 * @param {String} formName
 * @returns {Function} async action dispatcher
 */
export function Register (regInfo, formName) {
    return function (dispatch) {
        dispatch(UILoading(formName));   // state.ui
        dispatch(startSubmit(formName)); // state.forms , for redux-form

        return Zergling
            .get({user_info: regInfo}, 'register_user')
            .then((response) => {
                if (response.result === "OK") {
                    dispatch(stopSubmit(formName));
                    Config.main.regConfig.settings.loginAfterRegistration && Login((regInfo.username || regInfo.email), regInfo.password)(dispatch);
                } else {
                    dispatch(stopSubmit(formName, {error: response}));
                }
                dispatch(UILoadingDone(formName));
                return response;
            })
            .catch((data) => {
                dispatch(UILoadingFailed(formName, data));
                dispatch(stopSubmit(formName, {error: data}));
            });
    };
}

/**
 * @description Load registration captch
 * @returns {Function} async action dispatcher
 */
export function LoadCaptcha () {
    /**
     * @event loadCaptcha
     */
    return function (dispatch) {
        dispatch(UILoading("captcha"));
        Zergling
            .get({}, "get_captcha_url")
            .then(function (data) {
                console.log('captcha data', data);
                if (data.code === 0 && data.url) {
                    dispatch(loadCaptchaSuccess(data));
                    dispatch(UILoadingDone("captcha"));
                } else {
                    dispatch(loadCaptchaFailure(data));
                }
            })
            .catch((data) => {
                dispatch(loadCaptchaFailure(data));
                dispatch(UILoadingFailed("captcha", data));
            });
    };
}