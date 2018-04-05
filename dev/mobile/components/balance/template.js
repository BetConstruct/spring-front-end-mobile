import React from 'react';
import {Link} from 'react-router';
import Loader from "../../components/loader/";
import Expandable from "../../containers/expandable/";
import MoneyAmount from "../../components/moneyAmount/";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";

module.exports = function balanceTemplate () {
    let balance, bonus, totalBalance, casinoBalance,
        sportsbook = !!(Config.main.mainMenuItemsOrder && (Config.main.mainMenuItemsOrder.indexOf('prematch') !== -1 || Config.main.mainMenuItemsOrder.indexOf('live') !== -1)),
        casino = !!(Config.main.mainMenuItemsOrder && Config.main.mainMenuItemsOrder.indexOf('casino') !== -1);

    if (this.props.user.loggedIn && this.props.user.profile) {
        balance = this.props.user.profile.balance - this.props.user.profile.frozen_balance;
        bonus = this.props.user.profile.bonus_balance + this.props.user.profile.bonus_win_balance + this.props.user.profile.frozen_balance;
        totalBalance = balance + bonus;
    }
    casinoBalance = this.props.lastRouteType === "casino" && this.props.user.profile && this.props.user.profile.hasOwnProperty("casino_balance") && this.props.user.profile.casino_balance;
    return (
        this.props.user.loggedIn && this.props.user.profile
            ? <div className="user-balance-info-contain">
            <div className="import-view-container">
                <div className="balance-user-view-m">
                    <div className="deposit-b-total-b">
                        <ul>
                            <li>
                                <p>
                                    <span className="total-balance-m">{t(casinoBalance ? "Casino Balance" : "Total Balance")}</span>
                                    <span className="balance-c-m">
                                        <MoneyAmount
                                            amount={casinoBalance || totalBalance}
                                            currency={this.props.user.profile.currency_name}/>
                                    </span>
                                </p>
                            </li>
                            <li>
                                <Link to="/balance/deposit" onClick={this.props.closeRightMenu()}>
                                    <button className="button-view-normal-m">{t("Deposit")}</button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="bonus-view-m">
                        <ul>
                            <li>
                                <p className="bonus-title-m"><i>{t("Total Bonus Money")}</i></p>
                            </li>
                            <li>
                                <span className="bonus-count-m">
                                    <MoneyAmount amount={bonus}
                                                 currency={this.props.user.profile.currency_name}/>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="bonus-view-m withdraw-m">
                        <ul>
                            <li>
                                <p className="bonus-title-m"><i>{t("Withdrawable Money")}</i></p>
                            </li>
                            <li>
                                <span className="bonus-count-m">
                                    <MoneyAmount amount={balance}
                                                 currency={this.props.user.profile.currency_name}/>
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            <div className="import-view-container">
                <div className="universal-menu-wrapper">
                    <div className="single-universal-menu-contain">
                        <Expandable className="title-row-u-m" uiKey="rm_balance">
                            <div className="icon-view-u-m balance-view-m"></div>
                            <p><span>{t("Balance Management")}</span></p>
                            <i className="arrow-u-m"/>
                        </Expandable>
                        <div className="open-view-single-u-m">
                            <ul>
                                <li>
                                    <Link to="/balance/deposit" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("Deposit")}</span>
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/balance/withdraw" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("Withdraw")}</span>
                                        </p>
                                    </Link>
                                </li>
                                {
                                    Config.main.GmsPlatformMultipleBalance
                                        ? (
                                            <li>
                                                <Link to="/balance/transfer" onClick={this.props.closeRightMenu()}>
                                                    <p className="name-sub-u-m-title">
                                                        <i className="arrow-u-m"/>
                                                        <span>{t("Transfer")}</span>
                                                    </p>
                                                </Link>
                                            </li>
                                        )
                                        : (null)
                                }
                                <li>
                                    <Link to="/balance/history" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("History")}</span>
                                        </p>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/balance/withdraws" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("Withdraws")}</span>
                                        </p>
                                    </Link>
                                </li>

                            </ul>
                        </div>

                    </div>
                    <div className="single-universal-menu-contain">
                        {!Config.main.disableBonuses
                            ? <Expandable className="title-row-u-m" uiKey="rm_promo">
                                <div className="icon-view-u-m promo-view-m"/>
                                <p>
                                    <span>
                                        {t("Bonuses")}
                                        {Config.disableCasinoAndSportsBonusesToShow && !!(this.props.bonusData) && <i>{this.props.bonusData}</i>}
                                    </span>
                                </p>
                                <i className="arrow-u-m"/>
                              </Expandable>
                            : null
                        }
                        <div className="open-view-single-u-m">
                            <ul>
                                {Config.main.enableLoyaltyPoints ? <li>
                                    <Link to="/loyalty" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("Loyalty Points")}</span>
                                        </p>
                                    </Link>
                                </li> : null}
                                {sportsbook ? <li>
                                    <Link to="/bonus/sport" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("Sport Bonus")}</span>
                                        </p>
                                    </Link>
                                </li> : null}
                                {casino ? <li>
                                    <Link to="/bonus/casino" onClick={this.props.closeRightMenu()}>
                                        <p className="name-sub-u-m-title">
                                            <i className="arrow-u-m"/>
                                            <span>{t("Casino Bonus")}</span>
                                        </p>
                                    </Link>
                                </li> : null}
                            </ul>
                        </div>

                    </div>

                </div>
            </div>
        </div>
            : <Loader/>
    );
};
