import React from 'react';
import BalanceHistory from "../../components/balanceHistory/";
import {t} from "../../../helpers/translator";
import PaymentsNavigationMenu from "../../components/paymentsNavigationMenu/";

module.exports = function paymentsTemplate () {
    return (
        <div className="profile-view-wrapper">
            <div className="title-separator-contain-b">
                <h1>{t("Payments")}</h1>
            </div>

            <PaymentsNavigationMenu />

            {(() => {
                switch (this.props.route && this.props.route.path) {
                    case "history":
                        return <BalanceHistory/>;
                    default:
                        return null;
                }
            })()}
        </div>
    );
};
