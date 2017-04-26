import React from 'react';
import {Link} from 'react-router';
import Swipeable from 'react-swipeable';
import OddConverter from "../../../helpers/sport/oddConverter";
import Config from "../../../config/main";
import HorizontalLoader from "../../../components/horizontalLoader/";
import Loader from "../../components/loader/";
import Expandable from "../../containers/expandable/";
import MoneyAmount from "../../components/moneyAmount/";
import {t} from "../../../helpers/translator";
import Keyboard from "../../components/virtualKeyboard/";

import { doBetSlipViewCalculations, BetslipTypes, BETSLIP_TYPE_SINGLE, BETSLIP_TYPE_EXPRESS, BETSLIP_TYPE_SYSTEM, BETSLIP_TYPE_CHAIN
} from "../../../helpers/sport/betslip";

module.exports = function betslipTemplate () {
    // console.log("betslip props", this.props);
    let betSlip = this.props.betslip;
    var loggedIn = this.props.user.loggedIn;

    let {events, info, posWin, expOdds, expBonus, freeBetAvailable, priceChangeNeeds2bConfirmed, betsCannotBePlaced, displayInfo, systemOptions} =
        doBetSlipViewCalculations(this.props.betslip, this.props.data, this.props.user, this.props.currency, this.props.dispatch);

    return (
        <div onClick={(e) => {
            this.props.ui.showVirtualKeyBoard && !e.defaultPrevented && this.hideKeyboard();
        }} className={"betslip-m " + BetslipTypes[betSlip.type] + (loggedIn ? " logged-in" : " logged-out") + (betSlip.quickBet ? " quick" : "") + (this.props.ui.loading.bet ? " loading" : "")}>

            <Swipeable className="betslip-balance-view-m" onClick={this.props.openBetslip()} onSwipingUp={this.props.openBetslip()}>
                <ul>
                    {betSlip.quickBet
                        ? <li>
                            {this.props.ui.loading.bet
                                ? <p>{t("Making quick bet...")}<HorizontalLoader/></p>
                                : <p>{t("Quick bet mode")}</p>
                            }
                        </li>
                        : <li>
                            <span className="betslip-title-mini">
                                <i>{t("Betslip")}</i>
                                <b>{events.length}</b>
                            </span>
                        </li>}
                    {this.props.user.profile ? <li>
                        {betSlip.quickBet
                            ? <p className="balance-view-betslip">{t("Stake:")} <MoneyAmount onClick={this.openQuickBetStake} amount={parseFloat(betSlip.stake)}/></p>
                            : <p className="balance-view-betslip"><MoneyAmount amount={this.props.user.profile.balance}/></p>
                        }
                    </li> : null }

                </ul>
            </Swipeable>

            {/*betslip open view*/}
            <div className={"betslip-full-view" + (this.props.ui.opened.betslip ? " active" : "")}>
                <Swipeable className="betslip-header-m" onSwipingDown={this.props.closeBetslip()}>
                    <div className="quick-bet-settings-view">
                        <Swipeable className="switcher-box" onClick={this.toggleQuickBet}>
                            <div className={"switcher-contain" + (betSlip.quickBet ? " on" : "")}>
                                <div className="switcher-circle-b-m"/>
                            </div>
                        </Swipeable>

                        <h3>{t("Quick Bet")}</h3>

                        <div className={"betslip-settings" + (this.props.ui.opened.betslipSettings ? " open" : "") } onClick={this.toggleBetslipSettings}/>
                        <div className="b-settings-view-b">
                            <ul>
                                <li><p>{t("When price changes:")}</p></li>
                                <li>
                                    <div className="radio-form-item">
                                        <label>
                                            <input type="radio" name="odd-settings" value="0" defaultChecked={betSlip.acceptPriceChanges === 0} onClick={this.setAcceptOptions}/>
                                            <span>{t("Always ask")}</span></label>
                                    </div>
                                </li>
                                <li>
                                    <div className="radio-form-item">
                                        <label><input type="radio" name="odd-settings" value="1" defaultChecked={betSlip.acceptPriceChanges === 1} onClick={this.setAcceptOptions}/><span>{t("Accept higher odds")}</span></label>
                                    </div>
                                </li>
                                <li>
                                    <div className="radio-form-item">
                                        <label><input type="radio" name="odd-settings" value="2" defaultChecked={betSlip.acceptPriceChanges === 2} onClick={this.setAcceptOptions}/><span>{t("Accept any odds")}</span></label>
                                    </div>
                                </li>
                             </ul>
                        </div>
                        <div className="closed-betslip-icon" onClick={this.props.closeBetslip()}/>
                    </div>

                    {!betSlip.quickBet ? <div className="all-bets-settings-row-m">
                        <ul>
                            <li>
                                <div className="select-contain-m">
                                    <select onChange={this.setBetslipType} value={betSlip.type}>
                                        {Object.keys(BetslipTypes).map(type => <option key={type} value={type}>{t(BetslipTypes[type])}</option>)}
                                    </select>
                                </div>
                            </li>

                            {systemOptions ? <li className="system-select-option"><div className="select-contain-m">{systemOptions}</div></li> : null}

                            {events.length > 1 ? <li className="cleared-all-box"><div className="clear-all-m" onClick={this.clearBetslip}><span/></div></li> : null}

                        </ul>
                    </div> : null}

                </Swipeable>

                {!betSlip.quickBet ? <div className="betslip-events-container" ref="betslip-container">
                    {events.map((bet, index) => <div className={"single-event-contain-m" + (!bet.available ? " deleted" : "")} key={bet.eventId}>
                        <div className="team-name-view-b-m">
                            {bet.conflicts.length && betSlip.type !== BETSLIP_TYPE_SINGLE
                                ? [<Expandable className="icon-status-view-m event-error" uiKey={"btt" + bet.eventId}/>,
                                    <div className="sub-error-info multiline">
                                        <p>{t("This bet cannot be combined with:")}</p>
                                        {bet.conflicts.map(id =>
                                            <p>{betSlip.events[id].title} - {betSlip.events[id].marketName} - {betSlip.events[id].pick}</p>
                                        )}
                                    </div>]
                                : null}
                            {bet.blocked
                                ? [<Expandable className="icon-status-view-m event-blocked" uiKey={"btt" + bet.eventId}/>,
                                    <div className="sub-error-info"><p>{t("Event is blocked.")}</p></div>] : null}
                            {!bet.available
                                ? [<Expandable className="icon-status-view-m event-deleted" uiKey={"btt" + bet.eventId}/>,
                                    <div className="sub-error-info"><p>{t("Event is not available.")}</p></div>] : null}

                            {betSlip.type === BETSLIP_TYPE_SYSTEM ? <div className="icon-status-view-m">
                                <label className="checkbox-wrapper-m"><input type="checkbox" checked={bet.incInSysCalc} onChange={this.includeInSystemCalc(bet)}/>
                                    <span/>
                                </label>
                            </div> : null}

                            <Link to={`/game/${bet.gameId}`} onClick={this.props.closeBetslip()}>{bet.title}</Link>
                            <button className="event-remove-b-m" onClick={this.removeFromBetslip(bet.eventId)}/>
                        </div>

                        <div className="market-full-info-m">
                            <ul>
                                <li><p className="betmarket-name-m">{bet.marketName}</p></li>
                                {bet.initialPrice !== bet.price
                                    ? <li><span className="change-price-m">{OddConverter(bet.initialPrice, this.props.preferences.oddsFormat)}</span></li>
                                    : null}
                            </ul>
                            <ul>
                                <li><p className="bet-pick-name-m">{bet.pick} {bet.base}</p></li>
                                <li><span className="price-view-m">{OddConverter(bet.price, this.props.preferences.oddsFormat)}</span></li>
                            </ul>
                        </div>
                        {betSlip.type === BETSLIP_TYPE_SINGLE ? <div className="single-bet-m">
                         <div className="stake-form-b-m">
                            <ul>
                                {betSlip.eachWayMode ? <li>
                                    <div className="mini-table-b-m">
                                        <ul><li><div className="single-form-item">
                                            {/*<input type="number" step={step} pattern="[\d.]*" placeholder={t("Stake...")} value={bet.singleUnitStake} onChange={this.setUnitStake(bet)} onFocus={this.scrollBetSlipToElement}/>*/}
                                            <span onClick={(e) => {
                                                if (!this.props.ui.showVirtualKeyBoard) {
                                                    this.scrollBetSlipToElement(e);
                                                    this.openKeyBoard(bet.singleUnitStake, this.setUnitStake(bet), null, bet, e);
                                                }
                                            }}>{bet.singleUnitStake ? bet.singleUnitStake : t("Stake...")}</span>
                                        </div></li></ul>
                                    </div>
                                </li> : null}
                                <li>
                                    <div className="mini-table-b-m">
                                        <ul>
                                            <li><div className="single-form-item">
                                                {/*<input type="number" step={step} pattern="[\d.]*" placeholder={t("Stake...")} value={bet.singleStake} onChange={this.setStake(bet)} onFocus={this.scrollBetSlipToElement}/>*/}
                                                <span onClick={(e) => {
                                                    if (!this.props.ui.showVirtualKeyBoard) {
                                                        this.scrollBetSlipToElement(e);
                                                        this.openKeyBoard(bet.singleStake, this.setStake(bet), null, bet, e);
                                                    }
                                                }}>{bet.singleStake ? bet.singleStake : t("Stake...")}</span>
                                                </div></li>
                                            {loggedIn && betSlip.type !== BETSLIP_TYPE_CHAIN ? (
                                                <li className={this.props.ui.loading.getMaxBet ? "disabled" : ""} onClick={this.getMaxStake(bet)}>
                                                    <div className="max-bet-b-m"><span>{t("Max")}</span></div>
                                                </li>
                                                ) : (null)
                                            }
                                        </ul>
                                    </div>
                                </li>
                                {events.length > 1 && index === 0 ? <li onClick={this.setSameStakeOnOtherEvents(bet)}><div className="bet-price-button-m"/></li> : null}
                            </ul>
                        </div>

                        <div className="possible-win-container">
                            <ul>
                                <li><p className="possible-text-title-m">{t("Possible win:")}</p></li>
                                <li><span className="bet-win-price-m"><MoneyAmount amount={bet.singlePosWin}/></span></li>
                            </ul>
                        </div>
                        </div> : null}
                    </div>)}

                    <div className="superbet-wrapper">

                        {/*superbet*/}
                        {Config.betting.enableSuperBet && (Config.betting.allowSuperBetOnLive || !info.hasLiveEvents)
                            ? [
                                <div className="bet-kind-container" key="allowSuperBetOnLive">
                                    <div className="kind-of-bet superbet-icon"/>
                                    <p className="superbet-text">{t("Superbet")}</p>
                                    <div className="info-i-switcher-b superbet-s">
                                        <Expandable className="info-icon-k-bet" uiKey="superBetInfo"/>
                                        <div className="switcher-box" onClick={this.toggleSuperBet}>
                                            <div className={"switcher-contain " + (betSlip.superBet ? "on" : "")}>
                                                <div className="switcher-circle-b-m"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>,
                                <div className={"text-info-kind-bet " + (this.props.persistentUI.expanded.superBetInfo ? "active" : "")} key="text-info-kind-bet">
                                    <p>{t("SuperBet is a new offer that allows requesting a Max Bet Limit Increase for selected sporting events.")}</p>
                                </div>
                            ]
                            : null}

                        {/*superbet END*/}

                        {/*free bet*/}
                        {freeBetAvailable ? <div className="bet-kind-container free-bet-container">
                            <div className="kind-of-bet freebet-icon"/>
                            <p className="freebet-text">{t("Free Bet")}</p>
                            <div className="info-i-switcher-b freebet-s">
                                <Expandable className="info-icon-k-bet" uiKey="freeBetInfo"/>
                                <div className="switcher-box" onClick={this.toggleFreeBet}>
                                    <div className={"switcher-contain " + (betSlip.freeBet ? "on" : "")}>
                                        <div className="switcher-circle-b-m"/>
                                    </div>
                                </div>
                            </div>
                        </div> : null}

                        <div className={"text-info-kind-bet " + (this.props.persistentUI.expanded.freeBetInfo ? "active" : "")}>
                            <p>{t("FreeBet allows placing a free bet(using your bonus balance) for selected sporting events.")}</p>
                        </div>
                        {freeBetAvailable && betSlip.freeBet
                            ? <div className="free-bet-open-view">
                                <ul>
                                    <li><p>{t("Choose a stake:")}</p></li>
                                    {betSlip.freeBetsList.map((freeBetItem) =>
                                        <li>
                                            <div className="radio-form-item">
                                                <label onClick={this.selectFreeBet(freeBetItem.id, freeBetItem.amount)}>
                                                    <input type="radio" value={freeBetItem.amount} checked={parseInt(freeBetItem.id) === parseInt(betSlip.selectedFreeBetId)} name="free-bet"/>
                                                    <span><MoneyAmount amount={freeBetItem.amount}/></span>
                                                </label>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            : null}

                        {/*free bet END*/}
                    </div>

                    {/*total*/}
                    {events.length
                        ? <div className="total-view-price-pos-b">

                            <div className="ew-total-odd">
                                <ul>
                                    {info.hasEachWayReadyEvents
                                        ? <li><label className="ew-view-b">
                                            <input type="checkbox" defaultChecked={betSlip.eachWayMode} onChange={this.toggleEachWayMode}/>
                                            <span>{t("EW")}</span>
                                        </label></li>
                                        : null}
                                    {betSlip.type === BETSLIP_TYPE_EXPRESS && events.length > 1 && expOdds && expOdds !== 1 ? <li><p>{t("Odds:")} <span>{OddConverter(expOdds, this.props.preferences.oddsFormat)}</span></p></li> : null}
                                </ul>
                            </div>

                            <div className="stake-form-b-m">
                                    {betSlip.type !== BETSLIP_TYPE_SINGLE && !(freeBetAvailable && betSlip.freeBet)
                                        ? <ul>
                                            <li>
                                                <div className="mini-table-b-m">
                                                    <ul>
                                                        {betSlip.type === BETSLIP_TYPE_SYSTEM && events.length > 2
                                                            ? <li>
                                                                <div className="single-form-item">
                                                                    {/*<input type="number" step={step} pattern="[\d.]*" placeholder={t("Unit Stake...")} value={betSlip.unitStake} onChange={this.setUnitStake()} onFocus={this.scrollBetSlipToElement}/>*/}
                                                                    <span onClick={(e) => {
                                                                        if (!this.props.ui.showVirtualKeyBoard) {
                                                                            this.scrollBetSlipToElement(e);
                                                                            this.openKeyBoard(betSlip.unitStake, this.setUnitStake(), null, betSlip, e);
                                                                        }
                                                                    }}>{betSlip.unitStake ? betSlip.unitStake : t("Unit Stake...")}</span>
                                                                </div>
                                                            </li>
                                                            : null}
                                                        <li>
                                                            <div className="single-form-item">
                                                                {/*<input type="number" step={step} pattern="[\d.]*" placeholder={t("Stake...")} value={betSlip.stake} onChange={this.setStake()} onFocus={this.scrollBetSlipToElement}/>*/}
                                                                <span onClick={(e) => {
                                                                    if (!this.props.ui.showVirtualKeyBoard) {
                                                                        this.scrollBetSlipToElement(e);
                                                                        this.openKeyBoard(betSlip.stake, this.setStake(), null, betSlip, e);
                                                                    }
                                                                }}>{betSlip.stake ? betSlip.stake: t("Stake...")}</span>
                                                            </div>
                                                        </li>

                                                        {loggedIn && events.length && betSlip.type !== BETSLIP_TYPE_SYSTEM && betSlip.type !== BETSLIP_TYPE_CHAIN ? (
                                                            <li className={this.props.ui.loading.getMaxBet ? "disabled" : ""} onClick={this.getMaxStake(events)}>
                                                                <div className="max-bet-b-m"><span>{t("Max")}</span></div>
                                                            </li>
                                                            ) : (null)
                                                        }
                                                    </ul>
                                                </div>
                                        </li>
                                    </ul>
                                        : null}
                            </div>

                        {posWin > 0 ? <div className="possible-win-container">
                                        <ul>
                                            <li><p className="possible-text-title-m">{t("Possible win:")}</p></li>
                                            <li><span className="sum-bet-win-price-m"><MoneyAmount amount={posWin}/></span></li>
                                        </ul>
                                        {expBonus ? <ul>
                                            <li><p className="bonus-text-title-m">{t("Accumulator Bonus:")}</p></li>
                                            <li><span className="bonus-bet-win-price-m"><MoneyAmount amount={expBonus}/></span></li>
                                        </ul> : null}
                                        {expBonus ? <ul>
                                            <li><p className="total-win-m">{t("Total win:")}</p></li>
                                            <li><span className="total-win-price-m"><MoneyAmount amount={posWin + expBonus}/></span></li>
                                        </ul> : null}
                                   </div> : null}
                        </div>
                        : null}

                    {["error", "warning", "info"].map(type => displayInfo[type].map(message => <div className={"text-info-bet-m " + type}><p>{message}</p></div>))}

                    {betSlip.betAccepted
                        ? <div className="text-info-bet-m accept">
                        <p>{t("Bet accepted.")}</p>
                        {betSlip.betAccepted.details.is_superbet ? <p>{t("You will get notification about your super bet status soon.")}</p> : null}
                        <b onClick={this.resetBetslipStatus}/></div>
                        : null}
                    {betSlip.betFailed ? <div className="text-info-bet-m error"><p>{betSlip.betFailed.reason}</p><b onClick={this.resetBetslipStatus}/></div> : null}

                    {(priceChangeNeeds2bConfirmed) ? <div className="bet-button-container">
                        <div className="separator-box-buttons-m">
                            <button className="button-view-normal-m" onClick={this.acceptChanges}>{t("Accept Changes")}</button>
                        </div>
                    </div> : null}

                    {!this.props.ui.loading.bet ? <div className="bet-button-container">
                        <div className="separator-box-buttons-m">
                            <button className="button-view-normal-m" onClick={this.placeBet} disabled={betsCannotBePlaced}>{t("Place Bets")}</button>
                        </div>
                    </div> : <Loader/>}

                </div>
                    : <div className="q-bet-container">
                        {this.props.ui.opened.quickBetStake !== false
                        ? <div className="q-mini-box">
                            <div className="quick-bet-form-m" key="quickBetStake">
                                <ul>
                                    <li><div className="single-form-item">
                                        {/*<input type="hidden" defaultValue={betSlip.stake} ref="quickBetStake" />*/}
                                        <span onClick={(e) => {
                                            if (!this.props.ui.showVirtualKeyBoard) {
                                                this.openKeyBoard(betSlip.stake, this.setQuickBetStake, null, betSlip, e, this.saveQuickBetStake);
                                            }
                                        }}>{betSlip.stake || t("Stake...")}</span>
                                    </div></li>
                                    <li><div className="save-b-m"><button className="button-view-normal-m trans-m" onClick={this.saveQuickBetStake}>{t("Save")}</button></div></li>
                                </ul>
                            </div>
                            <div className="text-info-bet-m" key="quickBetInfo"><p>{t("Click on any odd to place a bet.")}</p></div>
                        </div>
                        : null}
                        {Object.keys(betSlip.quickBetNotifications).map(id =>
                            <div key={id} className={"text-info-bet-m " + betSlip.quickBetNotifications[id].type}>
                                <p>{betSlip.quickBetNotifications[id].msg}</p><b onClick={this.resetBetslipStatus}/>
                            </div>
                        )}

                    </div>
                }
            </div>
            {/*betslip open view END*/}
            {
                (() => {
                    return this.props.ui.showVirtualKeyBoard ? <Keyboard settings={this.keyboardSettings} bindToElement={false} /> : (null);
                })()
            }
        </div>
    );
};
