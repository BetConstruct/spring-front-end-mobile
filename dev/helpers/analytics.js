import Config from "../config/main";
import ReactGA from 'react-ga';
import * as actions from "../actions/actionTypes/";

/**
 * Actions to send GA events for
 * @type {{}}
 */
const ACTIONS_TO_LOG = {
    "Login": [actions.LOGGED_IN, actions.LOGGED_OUT, actions.LOGIN_FAILED, actions.SESSION_LOST],
    "UI": [actions.OPEN_POPUP, actions.UI_OPEN],
    "Favorites": [actions.FAVORITE_ADD, actions.FAVORITE_REMOVE, actions.FAVORITES_CLEAR],
    "Betslip": [actions.BETSLIP_ADD, actions.BETSLIP_REMOVE, actions.BETSLIP_SET_TYPE, actions.BETSLIP_ACCEPT_CHANGES, actions.BETSLIP_TOGGLE_QUICKBET, actions.BETSLIP_TOGGLE_SUPERBET, actions.BETSLIP_TOGGLE_FREEBET, actions.BETSLIP_BET_ACCEPTED, actions.BETSLIP_BET_FAILED],
    "Casino": [actions.SELECT_CASINO_GAMES_CATEGORY, actions.SELECT_CASINO_GAMES_PROVIDER, actions.SELECT_LIVE_CASINO_GAMES_PROVIDER],
    "Misc": [actions.CAPTCH_LOAD_FAILURE]
};

/**
 * Non-interactive action types (non-interactive flag will be set on GA event)
 * @type {{}}
 */
const NON_INTERACTIVE_ACTIONS = {
    [actions.SESSION_LOST]: true,
    [actions.CAPTCH_LOAD_FAILURE]: true
};

/**
 * Action object field to send as GA event label
 * @type {{}}
 */
const ACTION_VALUE_FIELD = {
    [actions.UI_OPEN]: "key",
    [actions.OPEN_POPUP]: "key",
    [actions.FAVORITE_ADD]: "id",
    [actions.FAVORITE_REMOVE]: "id",
    [actions.BETSLIP_TOGGLE_SUPERBET]: "enabled",
    [actions.BETSLIP_TOGGLE_QUICKBET]: "enabled",
    [actions.BETSLIP_TOGGLE_FREEBET]: "enabled",
    [actions.BETSLIP_SET_TYPE]: "betSlipType",
    [actions.SELECT_CASINO_GAMES_CATEGORY]: "payload",
    [actions.SELECT_CASINO_GAMES_PROVIDER]: "payload",
    [actions.SELECT_LIVE_CASINO_GAMES_PROVIDER]: "payload"
};

const actionsObj = Object.keys(ACTIONS_TO_LOG).reduce((acc, category) => {
    ACTIONS_TO_LOG[category].map(action => { acc[action] = category; });
    return acc;
}, {});

let googlePageView = () => {};

if (Config.main.googleAnalyticsId) {
    ReactGA.initialize(Config.main.googleAnalyticsId, {gaOptions: {}});
    googlePageView = () => {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    };
}

/**
 * Returns function that will log page views to analytics service
 * If analytics service is not configured, returned function will do nothing
 * @returns {function()}
 */
export function getPageViewLogger () {
    return () => {
        googlePageView();
        // other analytics can be added here later if needed (e.g. yandex metrika)
    };
}

/**
 * noop middleware
 * @param store
 */
const emptyMW = store => next => action => next(action);

/**
 * GA middleware
 * @param store
 */
const gaActionLogger = store => next => action => {
    try {
        if (actionsObj[action.type]) {
            let eventObj = {
                category: actionsObj[action.type],
                action: action.type,
                nonInteraction: !!NON_INTERACTIVE_ACTIONS[action.type],
                label: (action[ACTION_VALUE_FIELD[action.type]] || "").toString()
            };
            console.log("GA EVENT:", eventObj, action);
            ReactGA.event(eventObj);
        }
        return next(action);
    } catch (err) {
        console.error('GA middleware Caught an exception!', err);
        ReactGA.exception({ description: (err || "").toString(), fatal: false });
        throw err;
    }

};

export const gaMiddleWare = Config.main.googleAnalyticsId ? gaActionLogger : emptyMW;