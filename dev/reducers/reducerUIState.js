import _ from "lodash";
import {OPEN_POPUP, CLOSE_POPUP, UI_OPEN, UI_CLOSE, UI_LAST_ROUTE_TYPE, UI_CURRENT_ROUTE_TYPE, UI_PREVIOUS_PATH,
    CONFIRMATION_DIALOG_ANSWER, CONFIRMATION_DIALOG_RESET, UI_LOADING, UI_LOADING_DONE,
    UI_LOADING_RESET, UI_LOADING_FAILED, SCROLLED_TO_SPORT_ALIAS, SCROLL_TO_SPORT_ALIAS, TOGGLE_VIRTUAL_KEYBOARD} from "../actions/actionTypes/";

const UIStateReducer = (
    state = {
        opened: {},
        loading: {},
        failReason: {},
        confirmation: {},
        lastRouteType: "",
        previousPath: "",
        currentRouteType: "",
        callbackList: {},
        selectedSportAlias: ""
    },
    action = {}
    ) => {
    let ret = _.cloneDeep(state);

    switch (action.type) {
        case UI_OPEN:
            ret.opened[action.key] = true;
            return ret;
        case UI_CLOSE:
            action.key === "betslip" && (ret.showVirtualKeyBoard = false);
            ret.opened[action.key] = false;
            return ret;
        case UI_LOADING:
            ret.loading[action.key] = true;
            return ret;
        case UI_LOADING_DONE:
            ret.loading[action.key] = false;
            ret.failReason[action.key] = undefined;
            return ret;
        case UI_LOADING_FAILED:
            ret.loading[action.key] = false;
            ret.failReason[action.key] = action.reason;
            return ret;
        case UI_LOADING_RESET:
            delete ret.loading[action.key];
            delete ret.failReason[action.key];
            return ret;
        case CLOSE_POPUP:
            ret.popup = null;
            ret.popupParams = null;
            return ret;
        case OPEN_POPUP:
            ret.popup = action.key;
            ret.popupParams = action.payload;
            return ret;
        case UI_LAST_ROUTE_TYPE:
            ret.lastRouteType = action.routeType;
            return ret;
        case UI_PREVIOUS_PATH:
            ret.previousPath = action.path;
            return ret;
        case UI_CURRENT_ROUTE_TYPE:
            ret.currentRouteType = action.routeType;
            return ret;
        case CONFIRMATION_DIALOG_ANSWER:
            ret.confirmation[action.key] = {answer: action.answer, data: action.payload};
            return ret;
        case CONFIRMATION_DIALOG_RESET:
            delete ret.confirmation[action.key];
            return ret;
        case SCROLL_TO_SPORT_ALIAS :
            ret.selectedSportAlias = action.payload;
            return ret;
        case TOGGLE_VIRTUAL_KEYBOARD :
            ret.showVirtualKeyBoard = action.payload;
            return ret;
        case SCROLLED_TO_SPORT_ALIAS :
            delete ret.selectedSportAlias;
            return ret;
        default :
            return state;
    }
};

export default UIStateReducer;