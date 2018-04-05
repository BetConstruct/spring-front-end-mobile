import {CmsDataReceived} from "../actions/cms";
import {CONFIRMATION_DIALOG_ANSWER, CLOSE_POPUP, OPEN_POPUP} from "../actions/actionTypes";
import {OpenPopup} from "../actions/ui";
import {getPopupPayload, isCmsRegistrationPopupEnabled} from "../helpers/cmsPopupsHelper";
import Config from "../config/main";

/**
 * @name processUpdate
 * @description Helper function to get and update popups
 * @param {object} state
 * @param {string} id
 * @returns {object} updated popups
 * */
const processUpdate = (state, id) => ({
    ...state.cmsData.data.popups,
    popups: state.cmsData.data.popups.popups.filter((popup) => {
        return popup.id !== id;
    })
});

/**
 * @name popupsMiddleware
 * @description Helper middleware function to catch updates and fire new event to process direct update
 * @param {function} store
 * @constructor
 * @fire event:CmsDataReceived
 * */
const popupsMiddleware = store => next => action => {
    let state = store.getState(),
        popupParams = store.getState().uiState.popupParams,
        registrationPopup;
    switch (true) {
        case CONFIRMATION_DIALOG_ANSWER === action.type && action.payload instanceof Object && action.payload.hasOwnProperty("@external"):
            next(CmsDataReceived(processUpdate(state, action.payload.id), "popups"));
            break;
        case CLOSE_POPUP === action.type && popupParams && popupParams.data && popupParams.data.hasOwnProperty("@external"):
            next(CmsDataReceived(processUpdate(state, popupParams.id), "popups"));
            break;
        case OPEN_POPUP === action.type && action.key === "RegistrationForm":
            if (Config.main.regConfig && Config.main.regConfig.disabled) {
                return;
            }
            if ((registrationPopup = isCmsRegistrationPopupEnabled(state))) {
                return next(OpenPopup("confirm", getPopupPayload(registrationPopup)));
            }
            break;
        case OPEN_POPUP === action.type && action.key === "LoginForm" && Config.main.disabledPopups && Config.main.disabledPopups.LoginForm:
            return;
        case Config.main.keepLegacyActionPopups && CLOSE_POPUP === action.type && popupParams && popupParams.action && Config.main.legacyActions && Config.main.legacyActions.indexOf(popupParams.action) !== -1 && action.locationChanged:
            return;
    }
    return next(action);
};

export default popupsMiddleware;