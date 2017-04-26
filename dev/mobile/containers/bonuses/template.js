import React from 'react';
import BalanceHistory from "../../components/balanceHistory/";
import Config from "../../../config/main";
import Bonus from "../../components/bonus/";
import {t} from "../../../helpers/translator";
import {Link} from 'react-router';

module.exports = function paymentsTemplate () {
    let disableCasinoBonus = !!Config.casino && !Config.casino.disableCasinoBonus;

    return (
        <div className="profile-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("Bonuses")}</h1>
            </div>
            <div className="page-menu-contain">
                <ul>
                    {!Config.disableSportsbook
                    ? <li>
                        <Link activeClassName="active" to="/bonus/sport"><span>{t("Sport Bonus")}</span></Link>
                      </li>
                    : null}
                    {disableCasinoBonus ? <li>
                        <Link activeClassName="active" to="/bonus/casino"><span>{t("Casino Bonus")}</span></Link>
                    </li> : null}
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
