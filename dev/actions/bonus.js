import Zergling from '../helpers/zergling';
import {getErrorMessageByCode} from "../constants/errorCodes";
import {SwarmLoadingStart, SwarmLoadingDone, SwarmReceiveData} from "./swarm";
import {UILoadingDone, UILoadingFailed, UILoadingReset, OpenPopup} from "./ui";
import {t} from "../helpers/translator";

/**
 * @name LoadBonusData
 * @description  Load bonus details
 * @param {Boolean} casino
 * @returns {Function} async action dispatcher
 */
export function LoadBonusData (casino = false) {
    return function (dispatch) {
        var swarmDataKey = (casino ? "casino" : "sport") + "Bonuses";
        dispatch(SwarmLoadingStart(swarmDataKey));
        return Zergling
            .get({free_bonuses: !casino}, 'get_bonus_details')
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
 * @name ClaimBonus
 * @description  Claim bonus for given bonusId and product
 * @param {Number} bonusId
 * @param {Boolean} casino
 * @returns {Function} async action dispatcher
 */
export function ClaimBonus (bonusId, casino = false) {
    return function (dispatch) {
        let uiKey = "claimBonus" + bonusId;
        dispatch(UILoadingReset(uiKey));
        return Zergling
            .get({bonus_id: bonusId}, 'claim_bonus')
            .then((response) => {
                if (response.result === 0) {
                    dispatch(UILoadingDone(uiKey));
                    dispatch(OpenPopup("message", {
                        title: t("Success"),
                        type: "success",
                        body: t("Bonus claimed")
                    }));
                    dispatch(LoadBonusData(casino));
                } else {
                    dispatch(UILoadingFailed(uiKey, response.result));
                    dispatch(OpenPopup("message", {
                        title: t("Error"),
                        type: "error",
                        body: t("Cannot claim bonus.") + getErrorMessageByCode(response.result)
                    }));
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(uiKey, reason));
            });
    };
}

/**
 * @name CancelBonus
 * @description  Cancel active bonus for given bonusId and product
 * @param {Number} bonusId
 * @param {Boolean} casino
 * @returns {Function} async action dispatcher
 */
export function CancelBonus (bonusId, casino = false) {
    return function (dispatch) {
        let uiKey = "cancelBonus" + bonusId;
        dispatch(UILoadingReset(uiKey));
        return Zergling
            .get({bonus_id: bonusId}, 'cancel_bonus')
            .then((response) => {
                if (response.result === 0) {
                    dispatch(UILoadingDone(uiKey));
                    dispatch(OpenPopup("message", {
                        title: t("Success"),
                        type: "success",
                        body: t("Bonus cancelled")
                    }));
                    dispatch(LoadBonusData(casino));
                } else {
                    dispatch(UILoadingFailed(uiKey, response.result));
                    dispatch(OpenPopup("message", {
                        title: t("Error"),
                        type: "error",
                        body: t("Cannot cancel bonus.") + getErrorMessageByCode(response.result)
                    }));
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed(uiKey, reason));
            });
    };
}
