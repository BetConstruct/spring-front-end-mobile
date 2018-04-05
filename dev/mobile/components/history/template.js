import React from 'react';
import {Link, browserHistory} from 'react-router';
import {t} from "../../../helpers/translator";
import BetDetails from "../../components/betDetails/";
import Loader from "../../components/loader/";
import BetHistoryFilters from "../betHistoryFilters/index";
import BetsList from "./pices/betsList";
import Config from '../../../config/main';

module.exports = function historyTemplate () {
    let bets = this.props.swarmData.bets,
        loaded = this.props.swarmData.loaded,
        dataSelectorKey = this.isUnsettled() ? 'betHistory_unsettled' : 'betHistory_settled';

    /**
     * @name betHistoryContainer
     * @description return the template of bet history filter
     * @param {object} values
     * @returns {undefined}
     * */
    const betHistoryContainer = () => {
        return (
            <div>
                <BetHistoryFilters unSettled={this.isUnsettled()} />
                {loaded ? <BetsList key={dataSelectorKey} destroing={this.resetHistory} bets={bets} dataSelectorKey={dataSelectorKey}/> : <Loader/>}
            </div>
        );
    };

    return (
        <div className="profile-view-wrapper">
            <div className="title-separator-contain-b">
                {
                    Config.isPartnerIntegration && Config.isPartnerIntegration.mode && Config.isPartnerIntegration.mode.iframe
                        ? <div className="bread-crumbs-view-m">
                            <a onClick={browserHistory.goBack}>
                                <span className="back-arrow-crumbs"/>
                            </a>
                            <p>
                                <h1>{t("History")}</h1>
                            </p>
                        </div>
                        : <h1>{t("History")}</h1>
                }
            </div>

            <div className="page-menu-contain">
                <ul>
                    <li><Link activeClassName="active" to="/history/open-bets"><span>{t("Open bets")}</span></Link></li>
                    <li><Link activeClassName="active" to="/history/bets"><span>{t("Bet history")}</span></Link></li>
                </ul>
            </div>
            {(() => {
                switch (this.props.route && this.props.route.path) {
                    case "open-bets":
                    case "bets": return betHistoryContainer();
                    case "bet/:id": return <BetDetails id={this.props.routeParams.id} dataSelectorKey={dataSelectorKey}/>;
                    default: return null;
                }
            })()}
        </div>
    );
};
