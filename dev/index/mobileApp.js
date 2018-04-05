import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import promiseMiddleware from "redux-promise";
import {createStore, applyMiddleware, compose} from "redux";
import {autoRehydrate} from 'redux-persist';
import {browserHistory, hashHistory} from "react-router";
import allReducers from "../reducers/";
import Bootstrap from "./bootstrap";
import Config from "../config/main";
import {gaMiddleWare} from "../helpers/analytics";
import {syncHistoryWithStore} from 'react-router-redux';
import handleCashoutUpdate from "../middleware/handleCashoutUpdate";
import popupsMiddleware from "../middleware/popupsMiddleware";
import handleApiIntegrationPartnersActions from "../middleware/apiIntegartionActionSubscriber";
import RouterBuilder from "../components/router/index";

if (process.env.NODE_ENV === 'development') {
    window.perf = require('react-addons-perf'); // make profiler usable in console
}

//---------------------- Require skin custom JS if present
// const req = require.context("../../skins/" + __SKIN__ + "/mobile/", false, /^\.js\/index\.js$/);
const req = require.context("../../skins/" + __SKIN__ + "/mobile/", true, /^\.\/js\/index\.js$/);
Config.env.skinExports = (req.keys().indexOf('./js/index.js') !== -1) ? req('./js/index.js') : {};

//---------------------- Require default CSS
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(require.context("../mobile/scss/defaults", true, /^.*\.scss$/));  // all default scss

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let middlewares = [thunk, promiseMiddleware, handleCashoutUpdate, popupsMiddleware, gaMiddleWare];

Config.isPartnerIntegration && Config.isPartnerIntegration.mode && Config.isPartnerIntegration.mode.iframe && middlewares.push(handleApiIntegrationPartnersActions);

const store = process.env.NODE_ENV === 'development'
    ? createStore(allReducers, composeEnhancers(applyMiddleware(...middlewares)), autoRehydrate())
    : createStore(allReducers, applyMiddleware(...middlewares), autoRehydrate());

// Do the app bootstrapping and inform store that application is ready to run
// Layout component will render it's children only when application is ready
Bootstrap(store);

const appHistory = syncHistoryWithStore(Config.main.useBrowserHistory ? browserHistory : hashHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <RouterBuilder store={store} appHistory={appHistory} />
    </Provider>,
    document.getElementById('root')
);