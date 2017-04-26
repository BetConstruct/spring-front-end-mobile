import {detectConflicts} from "../helpers/sport/betslip";

import {
    BETSLIP_ADD, BETSLIP_REMOVE, BETSLIP_CLEAR, BETSLIP_SET_TYPE, BETSLIP_SET_EACH_WAY_MODE, BETSLIP_TOGGLE_QUICKBET,
    BETSLIP_ACCEPT_CHANGES, BETSLIP_SET_STAKE, BETSLIP_SET_UNIT_STAKE, BETSLIP_SET_SYSTEM_OPT, BETSLIP_SET_ACCEPT_OPT,
    BETSLIP_SET_INCLUDE_IN_SYSTEM_CALC, BETSLIP_BET_ACCEPTED, BETSLIP_BET_FAILED, BETSLIP_RESET_STATUS,
    BETSLIP_BET_PROCESSING, BETSLIP_QUICK_BET_NOTIFY, BETSLIP_QUICK_BET_NOTIFY_DISMISS, BETSLIP_TOGGLE_FREEBET,
    BETSLIP_TOGGLE_SUPERBET, BETSLIP_SET_FREE_BETS, BETSLIP_SELECT_FREE_BET, BETSLIP_TOGGLE_FREEBET_LOADING_STATE
} from "../actions/actionTypes/";

const filterNonNumeric = str => str.toString().replace(/[^0-9.,]/, "");

const BetslipReducer = (
    state = {
        events: {},
        bankerBetsCount: 0,
        type: 1,
        sysOptionValue: 2,
        stake: "",
        unitStake: "",
        eachWayMode: false,
        betterOddSelectionMode: false,
        freeBet: false,
        freeBetLoading: false,
        freeBetsList: [],
        selectedFreeBetId: null,
        selectedFreeBetAmount: null,
        bonusBet: false,
        betAccepted: null,
        betFailed: null,
        quickBet: false,
        superBet: false,
        quickBetNotifications: {},
        acceptPriceChanges: 0 //  0  ask , 1 - higher , 2 - any, -1 - superbet
    },
    action
) => {
    var ret = Object.assign({}, state);

    switch (action.type) {
        case BETSLIP_SET_TYPE:
            ret.type = action.betSlipType;
            return ret;
        case BETSLIP_ADD:
            ret.events = Object.assign({}, ret.events); //clone
            ret.events[action.payload.eventId] = action.payload;
            detectConflicts(ret.events);
            return ret;
        case BETSLIP_REMOVE:
            if (ret.events[action.payload.eventId]) {
                ret.events = Object.assign({}, ret.events); //clone
                delete ret.events[action.payload.eventId];
            }
            detectConflicts(ret.events);
            return ret;
        case BETSLIP_BET_PROCESSING:
            ret.events = Object.assign({}, ret.events); //clone
            action.eventIds.map(id => { ret.events[id] && (ret.events[id].processing = action.status); });
            return ret;
        case BETSLIP_CLEAR:
            ret.events = {};
            if (action.processedOnly) {
                Object.keys(ret.events).map(id => {
                    if (ret.events[id].processing) {
                        ret.events[id] = state.events[id];
                    }
                });
            }
            return ret;
        case BETSLIP_ACCEPT_CHANGES:
            ret.events = Object.assign({}, ret.events); //clone
            var toRemove = [];
            Object.keys(ret.events).map(id => {
                ret.events[id].initialPrice = ret.events[id].price;
                ret.events[id].initialBase = ret.events[id].base;
                if (!ret.events[id].available) {
                    toRemove.push(id);
                }
            });
            // toRemove.map(id => { delete ret.events[id]; });
            return ret;
        case BETSLIP_TOGGLE_QUICKBET:
            ret.quickBet = action.enabled;
            return ret;
        case BETSLIP_TOGGLE_SUPERBET:
            ret.superBet = action.enabled;
            return ret;
        case BETSLIP_TOGGLE_FREEBET:
            ret.freeBet = action.enabled;
            return ret;
        case BETSLIP_TOGGLE_FREEBET_LOADING_STATE:
            ret.freeBetLoading = action.payload;
            return ret;
        case BETSLIP_SET_EACH_WAY_MODE:
            ret.eachWayMode = action.value;
            return ret;
        case BETSLIP_SET_ACCEPT_OPT:
            ret.acceptPriceChanges = action.value;
            return ret;
        case BETSLIP_SET_SYSTEM_OPT:
            ret.sysOptionValue = action.value;
            return ret;
        case BETSLIP_SET_STAKE:
            if (action.eventId) {
                ret.events[action.eventId].singleStake = filterNonNumeric(action.value);
            } else {
                ret.stake = filterNonNumeric(action.value);
            }
            return ret;
        case BETSLIP_SET_INCLUDE_IN_SYSTEM_CALC:
            ret.events[action.eventId].incInSysCalc = action.value;
            return ret;
        case BETSLIP_SET_UNIT_STAKE:
            if (action.eventId) {
                ret.events[action.eventId].singleUnitStake = filterNonNumeric(action.value);
            } else {
                ret.unitStake = filterNonNumeric(action.value);
            }
            return ret;
        case BETSLIP_BET_ACCEPTED:
            console.log("bet accepted:", action.payload);
            ret.events = Object.assign({}, ret.events);
            action.payload.details.events.map(event => {
                ret.events[event.selection_id].processing = false;
            });
            ret.betAccepted = action.payload;
            return ret;
        case BETSLIP_BET_FAILED:
            ret.betFailed = action.payload;
            return ret;
        case BETSLIP_QUICK_BET_NOTIFY_DISMISS:
            ret.quickBetNotifications = Object.assign({}, ret.quickBetNotifications);
            delete ret.quickBetNotifications[action.id];
            return ret;
        case BETSLIP_QUICK_BET_NOTIFY:
            console.log("BETSLIP_QUICK_BET_NOTIFY", action);
            ret.quickBetNotifications = Object.assign({}, ret.quickBetNotifications);
            ret.quickBetNotifications[action.id] = {type: action.resultType, msg: action.payload};
            return ret;
        case BETSLIP_SET_FREE_BETS:
            ret.freeBetsList = action.payload;
            return ret;
        case BETSLIP_SELECT_FREE_BET:
            ret.selectedFreeBetId = action.id;
            ret.selectedFreeBetAmount = action.amount;
            return ret;
        case BETSLIP_RESET_STATUS:
            ret.betAccepted = null;
            ret.betFailed = null;
            ret.quickBetNotifications = {};
            return ret;
        default :
            return state;
    }
};

export default BetslipReducer;