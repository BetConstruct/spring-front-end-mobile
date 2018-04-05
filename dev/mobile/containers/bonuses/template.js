import React from 'react';
import BalanceHistory from "../../components/balanceHistory/";
import Config from "../../../config/main";
import Bonus from "../../components/bonus/";
import {t} from "../../../helpers/translator";
import {Link} from 'react-router';

module.exports = function paymentsTemplate () {
    let sportsbook = !!(Config.main.mainMenuItemsOrder && (Config.main.mainMenuItemsOrder.indexOf('prematch') !== -1 || Config.main.mainMenuItemsOrder.indexOf('live') !== -1)),
        casino = !!(Config.main.mainMenuItemsOrder && Config.main.mainMenuItemsOrder.indexOf('casino') !== -1);

    return (
        <div className="profile-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("Bonuses")}</h1>
            </div>
            <div className="page-menu-contain">
                <ul>
                    {
                        sportsbook
                            ? <li>
                            <Link activeClassName="active" to="/bonus/sport"><span>{t("Sport Bonus")}</span></Link>
                        </li>
                            : null
                    }
                    {
                        casino
                        ? <li>
                            <Link activeClassName="active" to="/bonus/casino"><span>{t("Casino Bonus")}</span></Link>
                          </li>
                        : null
                    }
                </ul>
            </div>

            {(() => {
                console.log("bonuses route", this.props.route && this.props.route.path, this.props);
                switch (this.props.route && this.props.route.path) {
                    case "history":
                        return <BalanceHistory/>;
                    case "bonus(/:type)":
                        return <Bonus type={this.props.routeParams.type} key={"bonus" + this.props.routeParams.type}/>;
                    default:
                        return null;
                }
            })()}
        </div>
    );
};
