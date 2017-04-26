import {
    PREMATCH_TIME_FILTER, PREMATCH_WIDGET_TIME_FILTER, UI_COLLAPSE_ELEMENT, UI_EXPAND_ELEMENT,
    UI_OPEN, UI_CLOSE, OPEN_POPUP, CLOSE_POPUP, UI_LAST_ROUTE_TYPE, UI_CURRENT_ROUTE_TYPE, UI_PREVIOUS_PATH, CONFIRMATION_DIALOG_ANSWER,
    CONFIRMATION_DIALOG_RESET, UI_LOADING, UI_LOADING_DONE, UI_LOADING_FAILED, UI_LOADING_RESET, LIVE_VIDEO_FILTER, HIDE_ANDROID_APP_DOWNLOAD_POPUP
} from './actionTypes/';

/**
 * @name HideAndroidDownloadPopup
 * @description sync action creator function.
 * @returns {Object}
 */
export const HideAndroidDownloadPopup = () => {
    /**
     * @event hideAppDownloadPopup
     * */
    return {
        type: HIDE_ANDROID_APP_DOWNLOAD_POPUP
    };
};

/**
 * @name PrematchTimeFilter
 * @description sync action creator function.
 * @param {object} message
 * @returns {Object}
 */
export const PrematchTimeFilter = (message) => {
    /**
     * @event prematchTimeFilter
     * */
    return {
        type: PREMATCH_TIME_FILTER,
        payload: message
    };
};

/**
 * @name LiveVideoFilter
 * @description sync action creator function.
 * @param {object} payload
 * @returns {Object}
 */
export const LiveVideoFilter = (payload) => {
    /**
     * @event changeLiveVideoFilter
     * */
    return {
        type: LIVE_VIDEO_FILTER,
        payload
    };
};

/**
 * @name PrematchWidgetTimeFilter
 * @description sync action creator function.
 * @param {object} message
 * @returns {Object}
 */
export const PrematchWidgetTimeFilter = (message) => {
    /**
     * @event changeWidgetFilter
    * */
    return {
        type: PREMATCH_WIDGET_TIME_FILTER,
        payload: message
    };
};

/**
 * @name UICollapseElement
 * @description sync action creator function.
 * Each expandable component must have unique key
 * @param {object} key
 * @returns {Object}
 */
export const UICollapseElement = (key) => {
    /**
     * @event collapseComponent
     * */
    return {
        type: UI_COLLAPSE_ELEMENT,
        payload: key
    };
};

/**
 * @name UIExpandElement
 * @description sync action creator function.
 * Each expandable component must have unique key
 * @param {object} key
 * @returns {Object}
 */
export const UIExpandElement = (key) => {
    /**
     * @event expandComponent
    * */
    return {
        type: UI_EXPAND_ELEMENT,
        payload: key
    };
};

/**
 * @name UIOpen
 * @description sync action creator function.
 * Open ui component
 * @param {object} key
 * @returns {Object}
 */
export const UIOpen = (key) => {
    /**
     * @event uiOpen
     * */
    return {
        type: UI_OPEN,
        key
    };
};

/**
 * @name UIClose
 * @description sync action creator function.
 * Close opened component
 * @param {object} key
 * @returns {Object}
 */
export const UIClose = (key) => {
    /**
     * @event uiClose
     * */
    return {
        type: UI_CLOSE,
        key
    };
};

/**
 * @name UILoading
 * @description sync action creator function.
 * Loading started
 * @param {object} key
 * @returns {Object}
 */
export const UILoading = (key) => {
    /**
     * @event uiLoadingStart
     * */
    return {
        type: UI_LOADING,
        key
    };
};

/**
 * @name UILoadingDone
 * @description sync action creator function.
 * Loading finished
 * @param {object} key
 * @returns {Object}
 */
export const UILoadingDone = (key) => {
    /**
     * @event uiLoadingDone
     * */
    return {
        type: UI_LOADING_DONE,
        key
    };
};

/**
 * @name UILoadingFailed
 * @description sync action creator function.
 * Loading filed and the file reason
 * @param {object} key
 * @param {object} reason
 * @returns {Object}
 */
export const UILoadingFailed = (key, reason) => {
    /**
     * @event uiLoadingFail
     */
    return {
        type: UI_LOADING_FAILED,
        key,
        reason
    };
};

/**
 * @name UILoadingReset
 * @description sync action creator function.
 * Clear loading data
 * @param {object} key
 * @returns {Object}
 */
export const UILoadingReset = (key) => {
    /**
     * @event uiLoadingReset
     */
    return {
        type: UI_LOADING_RESET,
        key
    };
};

/**
 * @name OpenPopup
 * @description sync action creator function.
 * To open popup and pass some payload.
 * It's impossible to open multiple popups at the same time.
 * @param {object} key
 * @param {*} payload
 * @returns {Object}
 */
export const OpenPopup = (key, payload) => {
    /**
     * @event openPopup
     */
    return {
        type: OPEN_POPUP,
        key,
        payload
    };
};

/**
 * @name ClosePopup
 * @description sync action creator function.
 * To close opened.
 * It's impossible to open multiple popups at the same time.
 * @returns {Object}
 */
export const ClosePopup = () => {
    /**
     * @event closePopup
     */
    return {
        type: CLOSE_POPUP
    };
};

/**
 * @name ConfirmationDialogAnswer
 * @description sync action creator function.
 * To close Confirmation dialog.
 * It's impossible to open multiple dialogs at the same time.
 * @param {string} key
 * @param {*} answer
 * @param {object} payload
 * @returns {Object}
 */
export const ConfirmationDialogAnswer = (key, answer, payload) => {
    /**
     * @event closeConfirmationDialog
     */
    return {
        type: CONFIRMATION_DIALOG_ANSWER,
        key,
        answer,
        payload
    };
};

/**
 * @name ConfirmationDialogReset
 * @description sync action creator function.
 * To reset Confirmation dialog data in redux storage.
 * @param {string} key
 * @returns {Object}
 */
export const ConfirmationDialogReset = (key) => {
    /**
     * @event resetConfirmationDialog
     */
    return {
        type: CONFIRMATION_DIALOG_RESET,
        key
    };
};

/**
 * @name UISetLastRouteType
 * @description sync action creator function.
 * To set last route type for example sport or casino.
 * @returns {Object} routeType
 */
export const UISetLastRouteType = (routeType) => {
    /**
     * @event setLastRouteType
     */
    return {
        type: UI_LAST_ROUTE_TYPE,
        routeType
    };
};

/**
 * @name UISetPreviousPath
 * @description sync action creator function.
 * To set previous route path for example history/bets.
 * @param {string} path
 * @returns {Object}
 */
export const UISetPreviousPath = (path) => {
    /**
     * @event setLastPreviousPath
     */
    return {
        type: UI_PREVIOUS_PATH,
        path
    };
};

/**
 * @name UISetCurrentRouteType
 * @description sync action creator function.
 * To set current route type for example sport or casino
 * @returns {Object} routeType
 */
export const UISetCurrentRouteType = (routeType) => {
    /**
     * @event setCurrentRouteType
     */
    return {
        type: UI_CURRENT_ROUTE_TYPE,
        routeType
    };
};