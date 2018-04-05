import {t} from "./translator";

/**
 * @name getPopupPayload
 * @description Helper function to collect externally loaded popups payload
 * @param {object} popup
 * @returns {object} popup payload
 * */
export const getPopupPayload = (popup) => {
    return {
        "title": t(popup.title),
        "type": "info",
        "body": popup.content,
        "id": popup.id,
        "answers": [{ "title": t("Ok"), "type": "warning", "value": true }],
        "data": {
            ...popup,
            "@external": true
        }
    };
};

/**
 * @name isCmsRegistrationPopupEnabled
 * @description Helper function to check if we should show any popup before registration
 * @param {object} state
 * @returns {object || boolean} registration popup data or false
 * */
export const isCmsRegistrationPopupEnabled = (state) => {
    let cmsData = state.cmsData.data,
        registrationPopup = cmsData.popups && cmsData.popups.popups && (cmsData.popups.popups.filter((popup) => popup.slug === "registration-popup") || [])[0];
    return registrationPopup || false;
};