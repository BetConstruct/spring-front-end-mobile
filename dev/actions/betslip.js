import Zergling from '../helpers/zergling';
import Config from "../config/main";
import {BETSLIP_ADD, BETSLIP_REMOVE, BETSLIP_CLEAR, BETSLIP_SET_TYPE, BETSLIP_TOGGLE_QUICKBET, BETSLIP_ACCEPT_CHANGES,
    BETSLIP_BET_ACCEPTED, BETSLIP_BET_FAILED, BETSLIP_SET_STAKE, BETSLIP_SET_UNIT_STAKE, BETSLIP_SET_EACH_WAY_MODE,
    BETSLIP_SET_SYSTEM_OPT, BETSLIP_SET_ACCEPT_OPT, BETSLIP_SET_INCLUDE_IN_SYSTEM_CALC, BETSLIP_RESET_STATUS,
    BETSLIP_BET_PROCESSING, BETSLIP_QUICK_BET_NOTIFY, BETSLIP_QUICK_BET_NOTIFY_DISMISS, BETSLIP_TOGGLE_FREEBET,
    BETSLIP_TOGGLE_SUPERBET, BETSLIP_SET_FREE_BETS, BETSLIP_SELECT_FREE_BET, BETSLIP_TOGGLE_FREEBET_LOADING_STATE
} from './actionTypes/';

import Helpers from "../helpers/helperFunctions";
import {t} from "../helpers/translator";
import {getErrorMessageByCode, errorCodes} from "../constants/errorCodes";

import {createBetRequests} from "../helpers/sport/betslip";

import {UILoading, UILoadingDone, UILoadingFailed, OpenPopup, ClosePopup} from "./ui";
import {FavoriteAdd} from "./favorites";

/**
 * @name BetslipAdd
 * @description  Add
 * @param {Object} payload bet event info
 * @returns {Function} async action dispatcher
 */
export const BetslipAdd = (payload) => {
    /**
     * @event betslipAdd
     */
    return {
        type: BETSLIP_ADD,
        payload
    };
};

/**
 * @name BetslipRemove
 * @description Remove given event from betslip
 * @param {Number} eventId
 * @returns {Object} New state
 */
export const BetslipRemove = (eventId) => {
    /**
     * @event betslipRemove
     */
    return {
        type: BETSLIP_REMOVE,
        payload: {eventId}
    };
};

/**
 * @name BetslipClear
 * @description Clear all events from betslip
 * @param {Boolean} processedOnly
 * @returns {Object} New state
 */
export const BetslipClear = (processedOnly = false) => {
    /**
     * @event betslipClear
     */
    return {
        type: BETSLIP_CLEAR,
        processedOnly
    };
};

/**
 * @name BetslipMarkBetProcessing
 * @description Mark in progress Bets
 * @param {Array} eventIds
 * @param {Boolean} state
 * @returns {Object} New state
 */
export const BetslipMarkBetProcessing = (eventIds, state = true) => {
    /**
     * @event betslipMarkBetProcessing
     */
    return {
        type: BETSLIP_BET_PROCESSING,
        eventIds,
        state
    };
};
/**
 * @name BetslipSetType
 * @description Set betslip type
 * @param {Number} betSlipType
 * @returns {Object} New state
 */
export const BetslipSetType = (betSlipType) => {
    /**
     * @event betslipSetType
     */
    return {
        type: BETSLIP_SET_TYPE,
        betSlipType
    };
};

/**
 * @name BetslipSetFreeBets
 * @description Set free bets
 * @param {Object} payload
 * @returns {Object} New state
 */
export const BetslipSetFreeBets = (payload) => {
    /**
     * @event betslipSetFreeBets
     */
    return {
        type: BETSLIP_SET_FREE_BETS,
        payload
    };
};

/**
 * @name BetslipSelectFreeBet
 * @description Select free Bet Events
 * @param {Number} id
 * @param {Number} amount
 * @returns {Object} New state
 */
export const BetslipSelectFreeBet = (id, amount) => {
    /**
     * @event betslipSelectFreeBet
     */
    return {
        type: BETSLIP_SELECT_FREE_BET,
        id,
        amount
    };
};
/**
 * @name BetslipToggleQuickBet
 * @description  Toggle quick bet switcher
 * @param {Boolean} enabled
 * @returns {Object} New state
 */
export const BetslipToggleQuickBet = (enabled) => {
    /**
     * @event betslipToggleQuickBet
     */
    return {
        type: BETSLIP_TOGGLE_QUICKBET,
        enabled
    };
};

/**
 * @name BetslipToggleFreeBet
 * @description  Toggle free bet switcher
 * @param {Boolean} enabled
 * @returns {Object} New state
 */
export const BetslipToggleFreeBet = (enabled) => {
    /**
     * @event betslipToggleFreeBet
     */
    return {
        type: BETSLIP_TOGGLE_FREEBET,
        enabled
    };
};

/**
 * @name BetslipToggleSuperBet
 * @description  Toggle super bet switcher
 * @param {Boolean} enabled
 * @returns {Object} New state
 */
export const BetslipToggleSuperBet = (enabled) => {
    /**
     * @event betslipToggleSuperBet
     */
    return {
        type: BETSLIP_TOGGLE_SUPERBET,
        enabled
    };
};

/**
 * @name BetslipAcceptChanges
 * @description Accept Odds change
 * @returns {Object} New state
 */
export const BetslipAcceptChanges = () => {
    /**
     * @event betslipAcceptChanges
     */
    return {
        type: BETSLIP_ACCEPT_CHANGES
    };
};

/**
 * @name BetslipBetAccepted
 * @description  Bet accepted by backend
 * @param {Object} payload
 * @returns {Object} New state
 */
export const BetslipBetAccepted = (payload) => {
    /**
     * @event betslipBetAccepted
     */
    return {
        type: BETSLIP_BET_ACCEPTED,
        payload
    };
};

/**
 * @name BetslipBetFailed
 * @description  Bet not accepted by backend
 * @param {Object} payload
 * @returns {Object} New state
 */
export const BetslipBetFailed = (payload) => {
    /**
     * @event betslipBetFailed
     */
    return {
        type: BETSLIP_BET_FAILED,
        payload
    };
};

/**
 * @name BetslipQuickBetNotify
 * @description Show Quick bet result
 * @param {Number} id
 * @param {String} resultType
 * @param {String} payload
 * @returns {Object} New state
 */
export const BetslipQuickBetNotify = (id, resultType, payload) => {
    /**
     * @event betslipQuickBetNotify
     */
    return {
        type: BETSLIP_QUICK_BET_NOTIFY,
        id,
        resultType,
        payload
    };
};

/**
 * @name BetslipQuickBetDismissNotification
 * @description Dismiss Quick bet Notification for given bet id
 * @param {Number} id
 * @returns {Object} New state
 */
export const BetslipQuickBetDismissNotification = (id) => {
    /**
     * @event betslipQuickBetDismissNotification
     */
    return {
        type: BETSLIP_QUICK_BET_NOTIFY_DISMISS,
        id
    };
};

/**
 * @name BetslipResetStatus
 * @description Reset betslip status
 * @returns {Object} New state
 */
export const BetslipResetStatus = () => {
    /**
     * @event betslipResetStatus
     */
    return {
        type: BETSLIP_RESET_STATUS
    };
};
/**
 * @name BetslipSetStake
 * @description Set betslip Stake
 * @param {Number} value
 * @param {Number} eventId
 * @returns {Object} New state
 */
export const BetslipSetStake = (value, eventId) => {
    /**
     * betslipSetStake
     */
    return {
        type: BETSLIP_SET_STAKE,
        value,
        eventId
    };
};

/**
 * @name BetslipSetInclInSysCalc
 * @description Set betslip Stake
 * @param {Number} value
 * @param {Number} eventId
 * @returns {Object} New state
 */
export const BetslipSetInclInSysCalc = (value, eventId) => {
    /**
     * @event betslipSetInclInSysCalc
     */
    return {
        type: BETSLIP_SET_INCLUDE_IN_SYSTEM_CALC,
        value,
        eventId
    };
};
/**
 * @name BetslipSetUnitStake
 * @description Set betslip unit stake
 * @param {Number} value
 * @param {Number} eventId
 * @returns {Object} New state
 */
export const BetslipSetUnitStake = (value, eventId) => {
    /**
     * @event betslipSetUnitStake
     */
    return {
        type: BETSLIP_SET_UNIT_STAKE,
        value,
        eventId
    };
};

/**
 * @name BetslipSetEachWayMode
 * @description  Enable or disable each way mode
 * @param {Boolean} value
 * @returns {Object} New state
 */
export const BetslipSetEachWayMode = (value) => {
    /**
     * @event betslipSetEachWayMode
     */
    return {
        type: BETSLIP_SET_EACH_WAY_MODE,
        value
    };
};

/**
 * @name BetslipSetSystemOpt
 * @description Set betslip system Option
 * @param {Number} value option type
 * @returns {Object} New state
 */
export const BetslipSetSystemOpt = (value) => {
    /**
     * @event BetslipSetSystemOpt
     */
    return {
        type: BETSLIP_SET_SYSTEM_OPT,
        value
    };
};

/**
 * @name BetslipSetAcceptOpt
 * @description Set betslip odds change accepting options
 * @param {Number} value
 * @returns {Object} New state
 */
export const BetslipSetAcceptOpt = (value) => {
    /**
     * @event betslipSetAcceptOpt
     */
    return {
        type: BETSLIP_SET_ACCEPT_OPT,
        value
    };
};

/**
 * @name BetslipToggleFreeBetLoadingState
 * @description toggle free bet loading state
 * @param {bool} payload
 * @returns {object} plain JavaScript object
 */
export const BetslipToggleFreeBetLoadingState = (payload) => {
    /**
     * @event betslipToggleFreeBetLoadingState
     */
    return {
        type: BETSLIP_TOGGLE_FREEBET_LOADING_STATE,
        payload
    };
};

/**
 * @name BetslipGetEventMaxBet
 * @description Get max bet value for given event ids
 * @param {Object | Array} betEvents
 * @returns {Function} async action dispatcher
 */
export const BetslipGetEventMaxBet = (betEvents) => {
    /**
     * @event betslipGetEventMaxBet
     */
    return function (dispatch) {
        dispatch(UILoading("getMaxBet"));
        let request = {}, id;
        if (Array.isArray(betEvents)) {
            request.events = betEvents.map(betEvent => betEvent.eventId);
        } else {
            request.events = [betEvents.eventId];
            id = betEvents.eventId;
        }
        Zergling.get(request, 'get_max_bet')
            .then(result => {
                dispatch(BetslipSetStake(parseFloat(result.result), id));
                dispatch(BetslipSetUnitStake(parseFloat(result.result / 2), id));
                dispatch(UILoadingDone("getMaxBet"));
            })
            .catch((reason) => {
                dispatch(UILoadingFailed("getMaxBet", reason));
            });
    };
};

/**
 * @name GetSuperBetInfo
 * @description Get super bet info by bet ib
 * @param {Number} betId bet id
 * @returns {Function} async action dispatcher
 * @constructor
 */
export const GetSuperBetInfo = (betId) => {
    /**
     * @event getSuperBetInfo
     */
    return function (dispatch) {
        dispatch(UILoading("getSuperBetInfo"));
        Zergling.get({where: {bet_id: betId, outcome: 0}}, 'bet_history')
            .then(result => {
                console.log("Super bet info recived:", result);
                dispatch(UILoadingDone("getSuperBetInfo"));
                dispatch(OpenPopup("CounterOfferDialog", {betInfo: result.bets[0]}));
            })
            .catch((reason) => {
                dispatch(UILoadingFailed("getSuperBetInfo", reason));
            });
    };
};

/**
 * @name AcceptCounterOffer
 * @description Accept super bet counter offer
 * @param {number} betId bet id
 * @returns {Function} async action dispatcher
 * @constructor
 */
export const AcceptCounterOffer = (betId) => {
    /**
     * @event acceptCounterOffer
     */
    return function (dispatch) {
        dispatch(UILoading("acceptCounterOffer"));
        Zergling.get({bet_id: betId, accept: true}, 'super_bet_answer')
            .then(result => {
                // TODO: process result
                console.log("approve_super_bet result:", result);
                if (result.result === 0) {
                    dispatch(UILoadingDone("acceptCounterOffer"));
                    dispatch(ClosePopup("CounterOfferDialog"));
                    dispatch(OpenPopup("message", {title: t("Counter Offer"), type: "info", body: t("Offer accepted")}));
                } else {
                    let OfferErrorMessage = errorCodes[result.result] ? t(getErrorMessageByCode(result.result)) : (t("Sorry we have some problems") + " (" + result.result + ")");
                    dispatch(OpenPopup("message", {title: t("Counter Offer"), type: "info", body: OfferErrorMessage}));
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed("acceptCounterOffer", reason));
            });
    };
};

/**
 * @name DeclineCounterOffer
 * @description Decline super bet counter offer
 * @param {Number} betId bet id
 * @returns {Function} async action dispatcher
 * @constructor
 */
export const DeclineCounterOffer = (betId) => {
    /**
     * @event declineCounterOffer
     */
    return function (dispatch) {
        dispatch(UILoading("declineCounterOffer"));
        Zergling.get({bet_id: betId, accept: false}, 'super_bet_answer')
            .then(result => {
                // TODO: process result
                console.log("decline_super_bet result:", result);
                if (result.result === 0) {
                    dispatch(UILoadingDone("declineCounterOffer"));
                    dispatch(ClosePopup("CounterOfferDialog"));
                    dispatch(OpenPopup("message", {title: t("Counter Offer"), type: "info", body: t("Offer declined")}));
                } else {
                    let OfferErrorMessage = errorCodes[result.result] ? t(getErrorMessageByCode(result.result)) : (t("Sorry we have some problems.") + " (" + result.result + ")");
                    dispatch(OpenPopup("message", {title: t("Counter Offer"), type: "info", body: OfferErrorMessage}));
                }
            })
            .catch((reason) => {
                dispatch(UILoadingFailed("declineCounterOffer", reason));
            });
    };
};

/**
 * @name BetslipLoadFreeBets
 * @description Loads free bet options for bets in betslip
 * @returns {Function} async action dispatcher
 * @constructor
 */
export const BetslipLoadFreeBets = () => {
    /**
     * @event betslipLoadFreeBets
     */
    return function (dispatch, getState) {
        let requests = createBetRequests(getState().betslip, null, true);
        if (requests && requests.length) {
            dispatch(BetslipToggleFreeBetLoadingState(true));
            Zergling.get(requests[0], 'get_freebets_for_betslip')
                .then(result => {
                    if (result && result.details && result.details.length) {
                        dispatch(BetslipSetFreeBets(result.details.reduce((acc, curr) => {
                            curr.amount && acc.push(curr);
                            return acc;
                        }, [])));
                    } else {
                        dispatch(BetslipSetFreeBets([]));
                        dispatch(BetslipSelectFreeBet(null));
                    }
                    dispatch(BetslipToggleFreeBetLoadingState(false));
                })
                .catch((reason) => {
                    console.warn("get_freebets_for_betslip error", requests, reason);
                    dispatch(BetslipSetFreeBets([]));
                    dispatch(BetslipSelectFreeBet(null));
                    dispatch(BetslipToggleFreeBetLoadingState(false));
                });
        }
    };
};

/**
 * @name BetslipPlaceBet
 * @description Places a bet
 * @param {Object} betSlipData betslip data from store
 * @param {Object} currency currency object, needed for calculating superbet limits
 * @param {bool} freeBet
 * @returns {Function} async action dispatcher
 * @constructor
 */
export const BetslipPlaceBet = (betSlipData, currency = null, freeBet = false) => {
    /**
     * @name getBetSlipError
     * @description generating betslip error
     * @param {object} result
     * @returns {string}
     */
    function getBetSlipError (result) {
        var code = Math.abs(parseInt(result.code || result.result || 99, 10)).toString();
        var isKnownError = getErrorMessageByCode(code, false);
        return isKnownError ? t(getErrorMessageByCode(code)) : (t("Sorry, we can't accept your bets now, please try later.") + " " + code);
    }

    /**
     * @name showQuickBetNotification
     * @description generating notification for quick bets
     * @param {object} responseData
     * @param {string} type
     * @param {function} dispatch
     * @returns {string}
     * @fire event:showQuickBetNotification
     */
    function showQuickBetNotification (responseData, type, dispatch) {
        console.log("showQuickBetNotification", responseData, type);
        if (betSlipData.quickBet) {
            let eventId = Helpers.firstElement(betSlipData.events).eventId;
            dispatch(BetslipQuickBetNotify(eventId, type, type === "error" ? getBetSlipError(responseData) : t("Bet {1} accepted", eventId)));
            setTimeout(() => { dispatch(BetslipQuickBetDismissNotification(eventId)); }, Config.betting.quickBetNotificationsTimeout);
        }
    }

    /**
     * @event betslipPlaceBet
     */
    return function (dispatch) {
        dispatch(BetslipResetStatus());

        function processBetResults (data) {
            console.log("bet result", data);
            dispatch(UILoadingDone("bet"));
            if (data.result === "OK") {

                //add to favorites
                data.details.events.map(event => { dispatch(FavoriteAdd("game", betSlipData.events[event.selection_id].gameId)); });

                Config.betting.resetAmountAfterBet && !betSlipData.quickBet && dispatch(BetslipSetStake(null));
                if (betSlipData.quickBet) {
                    showQuickBetNotification(data, "success", dispatch);
                } else {
                    dispatch(BetslipBetAccepted(data));
                }
                Config.betting.enableRetainSelectionAfterPlacment || dispatch(BetslipClear(true));
                console.log("removing status info in ", Config.betting.betAcceptedMessageTime);
                Config.betting.betAcceptedMessageTime && setTimeout(() => { dispatch(BetslipResetStatus()); }, Config.betting.betAcceptedMessageTime);
            } else {
                let generalBetResult;
                if (data.result === -1) {
                    generalBetResult = getBetSlipError(data);
                } else if (data.result === 3019) {
                    generalBetResult = t("Incompatible bet") + `(${data.result})`;
                } else {
                    if (errorCodes[data.result]) {
                        generalBetResult = t(getErrorMessageByCode(data.result + ((data.result === '1510' && Config.betting.allowManualSuperBet) ? '_sb' : '')));
                    } else {
                        generalBetResult = getBetSlipError(data);
                    }
                }

                if (betSlipData.quickBet) {
                    showQuickBetNotification(data, "error", dispatch);
                } else {
                    dispatch(BetslipBetFailed({reason: generalBetResult}));
                }
                // setTimeout(() => { dispatch(BetslipResetStatus()); }, Config.betting.betAcceptedMessageTime);
            }
        }
        let betPromises = [];
        dispatch(UILoading("bet"));
        dispatch(BetslipMarkBetProcessing(Object.keys(betSlipData.events)));
        var requests = createBetRequests(betSlipData, currency, freeBet);

        requests.map(request => {
            betPromises.push(
                Zergling.get(request, 'do_bet')
                    .then(processBetResults)
                    .catch((reason) => {
                        dispatch(UILoadingFailed("bet", reason));
                        console.log("bet failed", reason);
                        if (reason.code === 12) { // not logged in
                            dispatch(OpenPopup("LoginForm"));
                        } else {
                            processBetResults(reason);
                        }
                    })
                    .then(() => {
                        // refresh bonus for integration skins
                        // if (Config.partner.balanceRefreshPeriod || Config.main.rfid.balanceRefreshPeriod) {
                        //     dispatch(); //TODO
                        // }
                    })
            );
        });
        Promise.all(betPromises).then(() => {
            dispatch(UILoadingDone("bet"));
        });
    };
};