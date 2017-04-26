import Zergling from '../helpers/zergling';
import {startSubmit, stopSubmit} from 'redux-form';
import {SwarmLoadingStart, SwarmLoadingDone, SwarmReceiveData} from "./swarm";
import {UILoadingDone, UILoadingFailed, UILoadingReset} from "./ui";
import formsNames from "../constants/formsNames";
import {SWARM_DELETE_NESTED_DATA} from "../actions/actionTypes/";

/**
 * @description Load user messages
 * @param {Object} type
 * @returns {Function} async action dispatcher
 */
export function LoadUserMessages (type) {
    return function (dispatch) {
        var swarmDataKey = "messages";
        dispatch(SwarmLoadingStart(swarmDataKey));
        return Zergling
            .get({where: {type}}, 'user_messages')
            .then((response) => {
                dispatch(SwarmReceiveData(response, swarmDataKey));
            })
            .catch((reason) => {
                console.warn("error loading " + swarmDataKey, reason);
            })
            .then(() => dispatch(SwarmLoadingDone(swarmDataKey)));
    };
}

/**
 * @description Read user messages content by id
 * @param {Number} id
 * @returns {Function} async action dispatcher
 */
export function ReadUserMessage (id) {
    return function (dispatch) {
        let uiKey = "readUserMessage" + id;
        dispatch(UILoadingReset(uiKey));
        return Zergling
            .get({message_id: id}, 'read_user_message')
            .then(() => {
                dispatch(UILoadingDone(uiKey));
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(uiKey, reason));
            });
    };
}

/**
 * @description Delete user messages by id
 * @param {Number} messageId
 * @returns {Object} New state
 */
export function DeleteMessageById (messageId) {
    return {
        type: SWARM_DELETE_NESTED_DATA,
        path: "messages.messages",
        fieldName: "id",
        value: messageId
    };
}

/**
 * @description Confirm user message deletion
 * @param {Number} id
 * @param {Function} successCallback
 * @returns {Function} async action dispatcher
 */
export function DeleteUserMessage (id, successCallback) {
    return function (dispatch) {
        let uiKey = "deleteUserMessage" + id;
        dispatch(UILoadingReset(uiKey));
        return Zergling
            .get({message_id: id}, 'delete_user_message')
            .then(() => {
                dispatch(UILoadingDone(uiKey));
                successCallback && successCallback();
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(uiKey, reason));
            });
    };
}

/**
 * @description Send user message
 * @param {String} subject
 * @param {String} body
 * @returns {Function} async action dispatcher
 */
export function SendUserMessage (subject, body) {
    return function (dispatch) {
        let uiKey = "sendUserMessage";
        dispatch(UILoadingReset(uiKey));
        dispatch(startSubmit(formsNames.sendMessageForm));
        return Zergling.get({subject, body}, 'add_user_message')
            .then((response) => {
                if (parseInt(response.result, 10) === 0) {
                    dispatch(UILoadingDone(uiKey));
                    dispatch(stopSubmit(formsNames.sendMessageForm));
                } else {
                    dispatch(UILoadingFailed(uiKey, response.result));
                    dispatch(stopSubmit(formsNames.sendMessageForm));
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(uiKey, reason));
                dispatch(stopSubmit(formsNames.sendMessageForm, {reason}));
            });
    };
}