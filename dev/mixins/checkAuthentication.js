import React from 'react';
import Loader from "../mobile/components/loader/";
import {t} from "../helpers/translator";
import {OpenPopup} from "../actions/ui";

/**
 * A helper function to display a message on pages where login is required.
 * Can be used instead of template function in render method, i.e.
 * render () {
 *  return checkIfUserIsLoggedIn(...) || Template(...)
 *}
 * @param {Object} userState "user" state from store
 * @param {Function} dispatch store's dispatch method
 * @returns {*}
 */
export function checkIfUserIsLoggedIn (userState, dispatch) {
    if (userState.loginInProgress) {
        return <Loader/>;
    } else if (userState.loggedIn) {
        return null;
    } else {
        return <div className="please-login" onClick={() => dispatch(OpenPopup("LoginForm"))}>{t("Please login to access this page.")}</div>;
    }
}
