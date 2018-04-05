import React, {Component} from 'react';
import {Router, Route, IndexRoute} from "react-router";
import Layout from '../../mobile/containers/layout/';
import Live from '../../mobile/containers/live/';
import Prematch from '../../mobile/containers/prematch/';
import Casino from '../../mobile/containers/casino/';
import LiveCasino from '../../mobile/containers/liveCasino/';
import PrematchGamesList from '../../mobile/components/prematchGamesList/';
import History from '../../mobile/components/history/';
import Game from '../../mobile/containers/game/';
import Profile from '../../mobile/containers/profile/';
import DepositForm from '../../mobile/components/depositForm/';
import WithdrawForm from '../../mobile/components/withdrawForm/';
import Transfer from '../../mobile/components/transfer/';
import MethodsList from '../../mobile/components/paymentMethodsList/';
import Bonuses from '../../mobile/containers/bonuses/';
import LoyaltyPoints from '../../mobile/components/loyaltyPoints/';
import Messages from '../../mobile/components/messages/';
import Payments from '../../mobile/containers/payments/';
import CmsPage from '../../mobile/components/cmsPage/';
import HomeWrapper from '../../mobile/containers/homeWrapper/';
import ErrorNotFoundPage from '../../mobile/components/errorNotFoundPage/';
import Config from "../../config/main";
import FreeQuiz from "../../mobile/containers/freeQuiz/index";
import PropTypes from "prop-types";
import {getPageViewLogger} from "../../helpers/analytics";
import Helpers from "../../helpers/helperFunctions";

const checkInitialRoutes = (directPath) => {
    return Config.main.mainMenuItemsOrder.indexOf(directPath) !== -1;
};

const buildProfileRoute = () => {
    let isPartnerIntegration = Config.main.isPartnerIntegration;
    if (isPartnerIntegration && isPartnerIntegration.mode && (isPartnerIntegration.mode.iframe || (isPartnerIntegration.mode.externalLinks && isPartnerIntegration.externalLinks && isPartnerIntegration.externalLinks.registration))) {
        return null;
    }
    return (
        <Route path="profile">
            <IndexRoute component={Profile}/>
            <Route path="details" component={Profile}/>
            <Route path="change-password" component={Profile}/>
            {
                !Config.main.disableDocumentPageInMyProfile && <Route path="verify" component={Profile}/>
            }
            {
                Helpers.CheckIfPathExists(Config, "main.userSelfExclusion.enabled") && <Route path="self-exclusion" component={Profile}/>
            }
            {
                Helpers.CheckIfPathExists(Config, "main.userTimeOut.enabled") && <Route path="timeout-limits" component={Profile}/>
            }
            {
                Helpers.CheckIfPathExists(Config, "main.userDepositLimits.enabled") && <Route path="deposit-limits" component={Profile}/>
            }
            {
                Helpers.CheckIfPathExists(Config, "main.realityChecks.enabled") && <Route path="reality-checks" component={Profile}/>
            }
        </Route>
    );
};

class RouterBuilder extends Component {
    render () {
        let {props: {appHistory, store}} = this;
        return <Router history={appHistory} onUpdate={getPageViewLogger()}>
            {Config.env.skinExports.redirect /* specified index route may be defined by skin*/}
            {Config.env.skinExports.routerBuilder
                ? Config.env.skinExports.routerBuilder(store) /*partner requirements can be different we should give ability to specify custom routes and handlers vor skin*/
                : <Route path="/" component={Layout}>
                    <IndexRoute component={HomeWrapper}/>
                    {Config.env.skinExports.routes /* additional custom routes may be defined by skin */}
                    {Config.env.skinExports.routeBuilder && Config.env.skinExports.routeBuilder(store) /* additional custom routes may be defined by skin */}
                    {
                        checkInitialRoutes("live")
                            ? (
                                <Route path="live">
                                    <IndexRoute component={Live}/>
                                    <Route path="game/:gameId" component={Game}/>
                                    <Route path="(:sportAlias)" component={Live}/>
                                </Route>
                            )
                            : null
                    }
                    {
                        checkInitialRoutes("prematch")
                            ? (
                                <Route path="prematch">
                                    <IndexRoute component={Prematch}/>
                                    <Route path="game/:gameId" component={Game}/>
                                    <Route path="(:sportAlias)" component={Prematch}/>
                                    <Route path=":sportAlias/:regionAlias/:competitionId" component={PrematchGamesList}/>
                                </Route>
                            )
                            : null
                    }
                    {
                        checkInitialRoutes("casino")
                            ? (
                                <Route path="casino">
                                    <IndexRoute component={Casino}/>
                                </Route>
                            )
                            : null
                    }
                    {
                        checkInitialRoutes("live-casino")
                            ? (
                                <Route path="live-casino">
                                    <IndexRoute component={LiveCasino}/>
                                </Route>
                            )
                            : null
                    }

                    {
                        buildProfileRoute()
                    }

                    {
                        checkInitialRoutes("free-quiz")
                            ? (
                            <Route path="free-quiz">
                                <IndexRoute component={FreeQuiz}/>
                            </Route>
                        )
                            : null
                    }

                    {
                        !(Config.messages && Config.messages.disableMessage) && <Route path="messages(/:type)" component={Messages}/>
                    }
                    <Route path="game/:gameId" component={Game}/>
                    <Route path="page/:slug(/:section)" component={CmsPage}/>
                    <Route path="promo/:slug(/:section)" component={CmsPage}/>
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
                        <Route path="withdraws" component={Payments}/>
                        <Route path="transfer" component={Transfer}/>
                    </Route>
                    <Route path="history">
                        <Route path="open-bets" component={History}/>
                        <Route path="bets" component={History}/>
                        <Route path="bet/:id" component={History}/>
                    </Route>
                    <Route path="loyalty(/:action)" component={LoyaltyPoints}/>
                    <Route path="bonus(/:type)" component={Bonuses}/>
                    <Route path="*" component={ErrorNotFoundPage}/>
                </Route>
            }
        </Router>;
    }
}

RouterBuilder.propTypes = {
    appHistory: PropTypes.function,
    store: PropTypes.object
};

export default RouterBuilder;