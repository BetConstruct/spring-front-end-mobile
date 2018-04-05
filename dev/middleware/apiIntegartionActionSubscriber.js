import {USER_PROFILE_UPDATE_RECEIVED} from "../actions/actionTypes";
import Helpers from "../helpers/helperFunctions";

let lastUpdate = {};
/**
 * @name processUpdate
 * @description Helper function to collect partner specific data
 * @param {function} state
 * @returns {*}
 * */
const processProfileUpdate = (state, action) => {
    try {
        let profile = state.user && state.user.profile && state.user.profile.constructor === Object && Helpers.cloneDeep(state.user.profile),
            update = {
                ...profile,
                ...action.payload
            },
            externalListener = window.parent &&
                state.persistentUIState && state.persistentUIState.hashParams && state.persistentUIState.hashParams.callbackName &&
                window.parent[state.persistentUIState.hashParams.callbackName];

        if (JSON.stringify(lastUpdate) !== JSON.stringify({balance: update.balance, bonus_balance: update.bonus_balance})) {
            lastUpdate = {balance: update.balance, bonus_balance: update.bonus_balance};
            externalListener && externalListener("balance", lastUpdate);
        }
    } catch (error) {
        console.error(error);
    }

};

/**
 * @name handleUpdate
 * @description Helper middleware function to catch updates and fire new event to process direct update
 * @param {function} store
 * @constructor
 * @fire event:UpdateHistoryBets
 * */
const handleApiIntegrationPartnersActions = store => next => action => {
    switch (action.type) {
        case USER_PROFILE_UPDATE_RECEIVED:
            processProfileUpdate(store.getState(), action);
            break;
    }
    return next(action);
};

export default handleApiIntegrationPartnersActions;