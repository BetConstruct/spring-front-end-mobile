import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import promiseMiddleware from "redux-promise";
import {createStore, applyMiddleware, compose} from "redux";
import {autoRehydrate} from 'redux-persist';
import {Router, Route, IndexRoute, browserHistory, hashHistory} from "react-router";
import allReducers from "../reducers/";
import Layout from '../mobile/containers/layout/';
import Live from '../mobile/containers/live/';
import Prematch from '../mobile/containers/prematch/';
import Casino from '../mobile/containers/casino/';
import LiveCasino from '../mobile/containers/liveCasino/';
import PrematchGamesList from '../mobile/components/prematchGamesList/';
import History from '../mobile/components/history/';
import Game from '../mobile/containers/game/';
import Profile from '../mobile/containers/profile/';
import DepositForm from '../mobile/components/depositForm/';
import WithdrawForm from '../mobile/components/withdrawForm/';
import Transfer from '../mobile/components/transfer/';
import MethodsList from '../mobile/components/paymentMethodsList/';
import Bonuses from '../mobile/containers/bonuses/';
import LoyaltyPoints from '../mobile/components/loyaltyPoints/';
import Messages from '../mobile/components/messages/';
import Payments from '../mobile/containers/payments/';
import CmsPage from '../mobile/components/cmsPage/';
import HomeWrapper from '../mobile/containers/homeWrapper/';
import ErrorNotFoundPage from '../mobile/components/errorNotFoundPage/';
import {AppReady} from "../actions/";
import Bootstrap from "./bootstrap";
import Config from "../config/main";
import {getPageViewLogger, gaMiddleWare} from "../helpers/analytics";
import {syncHistoryWithStore} from 'react-router-redux';
import handleCashoutUpdate from "../middleware/handleCashoutUpdate";

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

const store = process.env.NODE_ENV === 'development'
    ? createStore(allReducers, composeEnhancers(applyMiddleware(thunk, promiseMiddleware, handleCashoutUpdate, gaMiddleWare)), autoRehydrate())
    : createStore(allReducers, applyMiddleware(thunk, promiseMiddleware, handleCashoutUpdate, gaMiddleWare), autoRehydrate());

// Do the app bootstrapping and inform store that application is ready to run
// Layout component will render it's children only when application is ready
Bootstrap(store).then(() => store.dispatch(AppReady()));

const appHistory = syncHistoryWithStore(Config.main.useBrowserHistory ? browserHistory : hashHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={appHistory} onUpdate={getPageViewLogger()}>
            {Config.env.skinExports.redirect /* specified index route may be defined by skin*/}
            {Config.env.skinExports.routerBuilder
                ? Config.env.skinExports.routerBuilder(store) /*partner requirements can be different we should give ability to specify custom routes and handlers vor skin*/
                : <Route path="/" component={Layout}>
                    <IndexRoute component={HomeWrapper}/>
                    {Config.env.skinExports.routes /* additional custom routes may be defined by skin */}
                    {Config.env.skinExports.routeBuilder && Config.env.skinExports.routeBuilder(store) /* additional custom routes may be defined by skin */}
                    <Route path="live">
                        <IndexRoute component={Live}/>
                        <Route path="game/:gameId" component={Game}/>
                        <Route path="(:sportAlias)" component={Live}/>
                    </Route>
                    <Route path="prematch">
                        <IndexRoute component={Prematch}/>
                        <Route path="game/:gameId" component={Game}/>
                        <Route path="(:sportAlias)" component={Prematch}/>
                        <Route path=":sportAlias/:regionAlias/:competitionId" component={PrematchGamesList}/>
                    </Route>
                    <Route path="game/:gameId" component={Game}/>
                    <Route path="page/:slug(/:section)" component={CmsPage}/>
                    <Route path="promo/:slug(/:section)" component={CmsPage}/>
                    <Route path="casino">
                        <IndexRoute component={Casino}/>
                    </Route>
                    <Route path="live-casino">
                        <IndexRoute component={LiveCasino}/>
                    </Route>
                    <Route path="profile">
                        <IndexRoute component={Profile}/>
                        <Route path="details" component={Profile}/>
                        <Route path="verify" component={Profile}/>
                        <Route path="change-password" component={Profile}/>
                        <Route path="self-exclusion" component={Profile}/>
                    </Route>

                    <Route path="loyalty(/:action)" component={LoyaltyPoints}/>
                    <Route path="bonus(/:type)" component={Bonuses}/>
                    <Route path="messages(/:type)" component={Messages}/>
                    <Route path="balance">
                        <IndexRoute component={Payments}/>
                        <Route path="deposit">
                            <IndexRoute component={MethodsList} forAction="deposit"/>
                            <Route path=":method" component={DepositForm}/>
                        </Route>
                        <Route path="withdraw">
                            <IndexRoute component={MethodsList} forAction="withdraw"/>
                            <Route path=":method" component={WithdrawForm}/>
                        </Route>
                        <Route path="bonus(/:type)" component={Payments}/>
                        <Route path="history" component={Payments}/>
                        <Route path="transfer" component={Transfer}/>
                    </Route>
                    <Route path="history">
                        <Route path="open-bets" component={History}/>
                        <Route path="bets" component={History}/>
                        <Route path="bet/:id" component={History}/>
                    </Route>
                    <Route path="*" component={ErrorNotFoundPage}/>
                </Route>
            }
        </Router>
    </Provider>,
    document.getElementById('root')
);