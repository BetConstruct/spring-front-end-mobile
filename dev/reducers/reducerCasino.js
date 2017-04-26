import {
    PROVIDERS_AND_CATEGORIES_LOADING_STARTED,
    PROVIDERS_AND_CATEGORIES_LOADING_FAILED,
    PROVIDERS_AND_CATEGORIES_LOADING_SUCCESS,
    CASINO_GAMES_LOADING_STARED,
    CASINO_GAMES_LOADING_FAILED,
    CASINO_GAMES_LOADING_SUCCESS,
    LIVE_CASINO_GAMES_LOADING_SUCCESS,
    LIVE_CASINO_GAMES_LOADING_FAILED,
    LIVE_CASINO_GAMES_LOADING_STARED,
    CASINO_GAMES_MOST_POPULAR_GAME_LOADING_STARED,
    CASINO_GAMES_MOST_POPULAR_GAME_LOADING_SUCCESS,
    CASINO_GAMES_MOST_POPULAR_GAME_LOADING_FAILED,
    SELECT_CASINO_GAMES_CATEGORY,
    SELECT_CASINO_GAMES_PROVIDER,
    SELECT_LIVE_CASINO_GAMES_PROVIDER
} from "../actions/actionTypes/";

import Config from '../config/main';

import _ from "lodash";

const addExternalData = (response) => {
    let allProviders = {name: 'all', id: 'all', title: 'All', categories: [{id: 'all', name: 'all', title: 'All'}]},
        allCategories = {name: 'all', id: 'all', title: 'All'},
        options = response.options;
    if (Config.casino.allProviders.showAll) {
        options.unshift(allProviders);
    }
    if (Config.casino.allCategories.showAll) {
        options.forEach(function (provider) {
            provider.name !== 'all' && provider.categories.unshift(allCategories);
        });
    }
    return options;
};

const fetchDataForLiveCasino = (gamesList) => {
    let returnValue = {
        providers: {}
    };
    gamesList.forEach((game) => {
        if (!returnValue.providers.hasOwnProperty(game.provider)) {
            returnValue.providers[game.provider] = [game];
        } else {
            returnValue.providers[game.provider].push(game);
        }
    });
    return returnValue;
};

const setLoadingState = (Obj, state) => {
    switch (state) {
        case 'loading':
            Obj.loading = true;
            Obj.loaded = false;
            Obj.failed = false;
            break;
        case 'loaded':
            Obj.loading = false;
            Obj.loaded = true;
            Obj.failed = false;
            break;
        default:
            Obj.loading = false;
            Obj.loaded = false;
            Obj.failed = true;
            break;
    }
    return Obj;
};

const CasinoReducer = (state = {categoriesAndProviders: {}, gamesList: {}, mostPopularGame: {}, liveCasino: {}}, action) => {
    let data;

    switch (action.type) {
        case PROVIDERS_AND_CATEGORIES_LOADING_STARTED:
            return {
                ...state,
                categoriesAndProviders: setLoadingState({}, 'loading')
            };
        case PROVIDERS_AND_CATEGORIES_LOADING_FAILED:
            return {
                ...state,
                categoriesAndProviders: setLoadingState({})
            };
        case PROVIDERS_AND_CATEGORIES_LOADING_SUCCESS:
            data = {
                categoriesAndProviders: {
                    providers: addExternalData(action.payload)
                }
            };
            return {
                ...state,
                categoriesAndProviders: setLoadingState(data.categoriesAndProviders, 'loaded')
            };
        case CASINO_GAMES_LOADING_STARED:
            data = {gamesList: _.cloneDeep(state.gamesList)};
            data.gamesList[action.uniqueId] = data.gamesList[action.uniqueId] || {list: []};
            setLoadingState(data.gamesList[action.uniqueId], 'loading');
            return {
                ...state,
                gamesList: data.gamesList
            };
        case CASINO_GAMES_LOADING_FAILED:
            data = {gamesList: _.cloneDeep(state.gamesList)};
            setLoadingState(data.gamesList[action.uniqueId]);
            return {
                ...state,
                gamesList: data.gamesList
            };
        case CASINO_GAMES_LOADING_SUCCESS:
            data = {gamesList: _.cloneDeep(state.gamesList)};
            data.gamesList[action.uniqueId] = data.gamesList[action.uniqueId] || {};
            data.gamesList[action.uniqueId].list = ((state.gamesList[action.uniqueId] || {list: []}).list).concat(action.payload);
            data.gamesList[action.uniqueId].from = action.from;
            data.gamesList[action.uniqueId].to = action.to;
            setLoadingState(data.gamesList[action.uniqueId], 'loaded');
            return {
                ...state,
                gamesList: data.gamesList
            };
        case CASINO_GAMES_MOST_POPULAR_GAME_LOADING_STARED :
            return {
                ...state,
                mostPopularGame: setLoadingState({}, 'loading')
            };
        case CASINO_GAMES_MOST_POPULAR_GAME_LOADING_SUCCESS :
            return {
                ...state,
                mostPopularGame: setLoadingState({}, 'loaded')
            };
        case CASINO_GAMES_MOST_POPULAR_GAME_LOADING_FAILED :
            return {
                ...state,
                mostPopularGame: setLoadingState({})
            };
        case SELECT_CASINO_GAMES_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload
            };
        case SELECT_CASINO_GAMES_PROVIDER:
            return {
                ...state,
                selectedProvider: action.payload
            };
        case LIVE_CASINO_GAMES_LOADING_STARED:
            return {
                ...state,
                liveCasino: setLoadingState({}, 'loading')
            };
        case LIVE_CASINO_GAMES_LOADING_FAILED:
            return {
                ...state,
                liveCasino: setLoadingState({})
            };
        case LIVE_CASINO_GAMES_LOADING_SUCCESS:
            data = fetchDataForLiveCasino(action.payload);
            return {
                ...state,
                liveCasino: setLoadingState(data, 'loaded')
            };
        case SELECT_LIVE_CASINO_GAMES_PROVIDER:
            data = {liveCasino: _.cloneDeep(state.liveCasino)};
            data.liveCasino.selectedProvider = action.payload;
            return {
                ...state,
                liveCasino: data.liveCasino
            };
        default :
            return state;
    }
};

export default CasinoReducer;