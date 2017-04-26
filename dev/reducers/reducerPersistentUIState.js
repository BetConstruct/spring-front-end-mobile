import _ from "lodash";
import {
    UI_COLLAPSE_ELEMENT,
    UI_EXPAND_ELEMENT,
    LIVE_VIDEO_FILTER,
    PREMATCH_TIME_FILTER,
    PREMATCH_WIDGET_TIME_FILTER,
    HIDE_ANDROID_APP_DOWNLOAD_POPUP
} from "../actions/actionTypes/";
import Config from "../config/main";

const UIStateReducer = (state = {
    prematchTimeFilter: 0,
    liveVideoFilter: 'all',
    hideDownloadAppPopup: false,
    prematchWidgetTimeFilter: Config.main.prematchWidgetTimeFilterValues[0],
    expanded: {}
}, action = {}) => {
    let ret = _.cloneDeep(state);
    switch (action.type) {
        case PREMATCH_TIME_FILTER:
            ret.prematchTimeFilter = action.payload;
            return ret;
        case HIDE_ANDROID_APP_DOWNLOAD_POPUP:
            ret.hideDownloadAppPopup = true;
            return ret;
        case LIVE_VIDEO_FILTER:
            ret.liveVideoFilter = action.payload;
            return ret;
        case PREMATCH_WIDGET_TIME_FILTER:
            ret.prematchWidgetTimeFilter = action.payload;
            return ret;
        case UI_COLLAPSE_ELEMENT:
            ret.expanded[action.payload] = false;
            return ret;
        case UI_EXPAND_ELEMENT:
            ret.expanded[action.payload] = true;
            return ret;
        default :
            return state;
    }
};

export default UIStateReducer;