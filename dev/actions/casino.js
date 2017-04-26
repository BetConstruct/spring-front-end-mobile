import 'whatwg-fetch';
import {
    PROVIDERS_AND_CATEGORIES_LOADING_SUCCESS,
    PROVIDERS_AND_CATEGORIES_LOADING_FAILED,
    PROVIDERS_AND_CATEGORIES_LOADING_STARTED,
    CASINO_GAMES_LOADING_SUCCESS,
    CASINO_GAMES_LOADING_FAILED,
    CASINO_GAMES_LOADING_STARED,
    LIVE_CASINO_GAMES_LOADING_SUCCESS,
    LIVE_CASINO_GAMES_LOADING_FAILED,
    LIVE_CASINO_GAMES_LOADING_STARED,
    CASINO_GAMES_MOST_POPULAR_GAME_LOADING_STARED,
    CASINO_GAMES_MOST_POPULAR_GAME_LOADING_SUCCESS,
    CASINO_GAMES_MOST_POPULAR_GAME_LOADING_FAILED,
    SELECT_CASINO_GAMES_CATEGORY,
    SELECT_CASINO_GAMES_PROVIDER,
    SELECT_LIVE_CASINO_GAMES_PROVIDER
} from './actionTypes/';

import Config from "../config/main";

/**
 * @name CmsLoadData
 * @description  Load cms data for casino and live casino
 * @param {String} what should load
 * @param {String} category selected category
 * @param {String} provider selected provider
 * @param {Number} from limitation
 * @param {Number} to limitation
 * @param {String} searchCommand search query
 * @returns {Function} async action creator
 */
export const CmsLoadData = (what, category, provider, from = 0, to = (Config.casino.games.loaderStep || 12), searchCommand = '') => {
    let url,
        dispatcher = {
            /**
             * @name success
             * @description helper function to check and call according callback with dispatch or just response
             * @returns {Undefined}
             */
            success: function (data) {
                let self = this;
                this.doNotDispatch ? self.successAction(data) : self.dispatch(self.successAction(data));
            },
            /**
             * @name start
             * @description helper function to dispatch according start action
             * @returns {Undefined}
             */
            start: function () {
                let self = this;
                this.doNotDispatch ? self.startedAction() : self.dispatch(self.startedAction());
            },
            /**
             * @name failed
             * @description helper function to dispatch according fail action
             * @param {Object} error fail reason
             * @returns {Undefined}
             */
            failed: function (error) {
                let self = this;
                this.doNotDispatch ? self.failedAction(error) : self.dispatch(self.failedAction(error));
            },
            /**
             * @name init
             * @description init method that stores dispatch function and doNotDispatch property for future use
             * @param {Function} dispatch
             * @param {Boolean} doNotDispatch
             * @returns {Undefined}
             */
            init: function (dispatch, doNotDispatch) {
                this.dispatch = dispatch;
                this.doNotDispatch = doNotDispatch;
            }
        };

    /**
     * @name CategoriesAndProvidersLoadingStart
     * @description plain action creator
     * @returns {Object} plain javascript object
     */
    const CategoriesAndProvidersLoadingStart = () => {
        return {
            type: PROVIDERS_AND_CATEGORIES_LOADING_STARTED
        };
    };

    /**
     * @name CategoriesAndProvidersLoadingSuccess
     * @description plain action creator
     * @param {Object} payload loaded data
     * @returns {Object} plain javascript object
     */
    const CategoriesAndProvidersLoadingSuccess = (payload) => {
        return {
            type: PROVIDERS_AND_CATEGORIES_LOADING_SUCCESS,
            payload
        };
    };

    /**
     * @name CategoriesAndProvidersLoadingFailed
     * @description plain action creator
     * @param {Object} payload fail reason
     * @returns {Object} plain javascript object
     */
    const CategoriesAndProvidersLoadingFailed = (payload) => {
        return {
            type: PROVIDERS_AND_CATEGORIES_LOADING_FAILED,
            payload
        };
    };

    /**
     * @name GameListLoadingStart
     * @description plain action creator
     * @returns {Object} plain javascript object
     */
    const GameListLoadingStart = () => {
        return {
            type: CASINO_GAMES_LOADING_STARED,
            uniqueId: 'casino_categories_' + category + '::' + provider
        };
    };

    /**
     * @name GameListLoadingSuccess
     * @description plain action creator
     * @param {Object} payload loaded data
     * @returns {Object} plain javascript object
     */
    const GameListLoadingSuccess = (payload) => {
        return {
            type: CASINO_GAMES_LOADING_SUCCESS,
            payload: payload.games,
            uniqueId: 'casino_categories_' + category + '::' + provider,
            from,
            to
        };
    };

    /**
     * @name GameListLoadingFailed
     * @description plain action creator
     * @param {Object} payload fail reason
     * @returns {Object} plain javascript object
     */
    const GameListLoadingFailed = (payload) => {
        return {
            type: CASINO_GAMES_LOADING_FAILED,
            uniqueId: 'casino_categories_' + category + '::' + provider,
            payload
        };
    };

    /**
     * @name LiveCasinoGameListLoadingStart
     * @description plain action creator
     * @returns {Object} plain javascript object
     */
    const LiveCasinoGameListLoadingStart = () => {
        return {
            type: LIVE_CASINO_GAMES_LOADING_STARED
        };
    };

    /**
     * @name LiveCasinoGameListLoadingSuccess
     * @description plain action creator
     * @param {Object} payload loaded data
     * @returns {Object} plain javascript object
     */
    const LiveCasinoGameListLoadingSuccess = (payload) => {
        return {
            type: LIVE_CASINO_GAMES_LOADING_SUCCESS,
            payload: payload.games
        };
    };

    /**
     * @name LiveCasinoGameListLoadingFailed
     * @description plain action creator
     * @param {Object} payload fail reason
     * @returns {Object} plain javascript object
     */
    const LiveCasinoGameListLoadingFailed = (payload) => {
        return {
            type: LIVE_CASINO_GAMES_LOADING_FAILED,
            payload
        };
    };

    /**
     * @name MostPopularGameLoadingStart
     * @description plain action creator
     * @returns {Object} plain javascript object
     */
    const MostPopularGameLoadingStart = () => {
        return {
            type: CASINO_GAMES_MOST_POPULAR_GAME_LOADING_STARED
        };
    };

    /**
     * @name MostPopularGameLoadingSuccess
     * @description plain action creator
     * @param {Object} payload loaded data
     * @returns {Object} plain javascript object
     */
    const MostPopularGameLoadingSuccess = (payload) => {
        return {
            type: CASINO_GAMES_MOST_POPULAR_GAME_LOADING_SUCCESS,
            payload: payload.widgets[0] || {}
        };
    };

    /**
     * @name MostPopularGameLoadingFailed
     * @description plain action creator
     * @param {Object} payload fail reason
     * @returns {Object} plain javascript object
     */
    const MostPopularGameLoadingFailed = (payload) => {
        return {
            type: CASINO_GAMES_MOST_POPULAR_GAME_LOADING_FAILED,
            payload
        };
    };

    switch (what) {
        case 'mostPopularGame':
            url = (`${Config.cms.url}json?base_host=${Config.cms.baseHost}&lang=${Config.env.lang}&json=${Config.cms.mostPopularGame.json}&sidebar_id=${Config.cms.mostPopularGame.sidebarId}${Config.env.lang}`);
            dispatcher.startedAction = MostPopularGameLoadingStart;
            dispatcher.successAction = MostPopularGameLoadingSuccess;
            dispatcher.failedAction = MostPopularGameLoadingFailed;
            break;
        case 'getGroupedProviderOptions':
            url = (`${Config.casino.url}${what}?partner_id=${Config.main.site_id}&is_mobile=1`);
            dispatcher.startedAction = CategoriesAndProvidersLoadingStart;
            dispatcher.successAction = CategoriesAndProvidersLoadingSuccess;
            dispatcher.failedAction = CategoriesAndProvidersLoadingFailed;
            break;
        case 'getGames':
            url = (`${Config.casino.url}${what}?partner_id=${Config.main.site_id}&is_mobile=1`);
            if (category !== null && category !== 'all') {
                url += '&category=' + category;
            }
            if (provider !== null && provider !== 'all' && provider !== undefined) {
                url += '&provider=' + provider;
            }
            if (from !== undefined && from !== null) {
                url += '&offset=' + from;
            }
            if (to !== undefined && to !== null) {
                url += '&limit=' + to;
            }
            if (searchCommand) {
                url += '&search=' + searchCommand;
            }
            dispatcher.startedAction = GameListLoadingStart;
            dispatcher.successAction = GameListLoadingSuccess;
            dispatcher.failedAction = GameListLoadingFailed;
            break;
        case 'getLiveCasinoGames' :
            url = (`${Config.casino.url}getGames?partner_id=${Config.main.site_id}&category=28&count=all&is_mobile=1`);
            dispatcher.startedAction = LiveCasinoGameListLoadingStart;
            dispatcher.successAction = LiveCasinoGameListLoadingSuccess;
            dispatcher.failedAction = LiveCasinoGameListLoadingFailed;
            break;
        case 'searchForCasinoGames':
            url = (`${Config.casino.url}getGames?partner_id=${Config.main.site_id}&is_mobile=1&count=all&visibleCatIds=28`);
            if (searchCommand) {
                url += '&search=' + searchCommand;
            }
            break;
    }

    /**
     * @name checkStatus
     * @description helper function to check request status and throw exception when something is wrong
     * @param {Object} response
     * @returns {Object | Undefined}
     */
    function checkStatus (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

    /**
     * @description async action
     * @param {Function} dispatch Redux store dispatch function
     * @param {Function} startCallback start callback
     * @param {Function} successCallback success callback
     * @param {Function} errorCallback error callback
     * @param {Boolean} doNotDispatch should dispatch an action or just call callback
     * @event cmsLoadData
     */
    return function (dispatch, startCallback, successCallback, errorCallback, doNotDispatch) {

        if (startCallback && successCallback && errorCallback) {
            dispatcher.startedAction = startCallback;
            dispatcher.successAction = successCallback;
            dispatcher.failedAction = errorCallback;
        }
        dispatcher.init(dispatch, doNotDispatch);
        dispatcher.start();
        fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then((json) => {
                delete json.status;
                dispatcher.success(json);
            })
            .catch((error) => {
                dispatcher.failed(error);
            });
    };
};

/**
 * @name SelectCategory
 * @description plain action creator
 * @param {String} payload selected category id
 * @returns {Object} plain javascript object
 */
export const SelectCategory = (payload) => {
    /**
     * @event selectCategory
     */
    return {
        type: SELECT_CASINO_GAMES_CATEGORY,
        payload
    };
};

/**
 * @name SelectProvider
 * @description plain action creator
 * @param {String} payload selected provider name
 * @returns {Object} plain javascript object
 */
export const SelectProvider = (payload) => {
    /**
     * @event selectProvider
     */
    return {
        type: SELECT_CASINO_GAMES_PROVIDER,
        payload
    };
};

/**
 * @name SelectLiveCasinoProvider
 * @description plain action creator
 * @param {String} payload selected provider name
 * @returns {Object} plain javascript object
 */
export const SelectLiveCasinoProvider = (payload) => {
    /**
     * @event selectLiveCasinoProvider
     */
    return {
        type: SELECT_LIVE_CASINO_GAMES_PROVIDER,
        payload
    };
};