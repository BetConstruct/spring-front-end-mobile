import React from 'react';
import Loader from "../../components/loader/";
import MoneyAmount from "../../components/moneyAmount/";
import {t} from "../../../helpers/translator";

module.exports = function CounterOfferDialogTemplate () {
    console.log("CounterOfferDialog props", this.props);
    return <div className="counter-offer-dialog">
                <div className="counter-offer-column-view">
                    <div className="counter-offer-title">
                        <h2>{t("SuperBet Counter Offer")}</h2>
                    </div>
                    <div className="competition-event-name-offer">
                        <p>{this.props.betInfo.events[0].sport_name} - {this.props.betInfo.events[0].region_name} - {this.props.betInfo.events[0].competition_name}</p>
                        <p>{this.props.betInfo.events[0].game_name}</p>
                        <p>{this.props.betInfo.events[0].market_name} - {this.props.betInfo.events[0].event_name}</p>
                    </div>

                    <table className="counter-view-info">
                        <tr>
                            {/*<th>{t("Bet Details")}</th>*/}
                            <th>{t("Offer Details")}</th>
                        </tr>
                        <tr>
                            {/*<td><span>{t("Odds:")}</span> <b className="odd-view-c-offer">1.5</b></td>*/}
                            <td><span>{t("Odds:")}</span> <b className="odd-view-c-offer">{this.props.betInfo.k}</b></td>
                        </tr>
                        <tr>
                            {/*<td><span>{t("Amount:")}</span> <MoneyAmount amount="1"/></td>*/}
                            <td><span>{t("Amount:")}</span> <MoneyAmount amount={this.props.betInfo.amount}/></td>
                        </tr>
                    </table>

                    {/*<p className="r-time">{t("Remaining time:")} 01:02:03</p>*/}
                    <div className="counter-offer-buttons-view">
                        <button className="button-view-normal-m" onClick={this.acceptOffer} disabled={this.props.ui.loading.acceptCounterOffer}>{t("Accept")}</button>
                    </div>
                    <div className="counter-offer-buttons-view">
                        <button className="button-view-normal-m cancel-b" onClick={this.declineOffer} disabled={this.props.ui.loading.declineCounterOffer}>{t("Decline")}</button>
                    </div>
                    {this.props.ui.loading.acceptCounterOffer || this.props.ui.loading.declineCounterOffer
                        ? <Loader/>
                        : null}
                    <div className="offer-status">
{/*                        {this.props.ui.loading.acceptCounterOffer === false && !this.props.ui.failReason.acceptCounterOffer
                            ? <p className="accepted">{t("Offer accepted.")}</p> : null}

                        {this.props.ui.loading.declineCounterOffer === false && !this.props.ui.failReason.declineCounterOffer
                            ? <p className="declined">{t("Offer declined.")}</p> : null}*/}

                        {this.props.ui.failReason.acceptCounterOffer
                            ? <p className="error">{t("Cannot accept counter offer.")}</p> : null}
                        {this.props.ui.failReason.declineCounterOffer
                            ? <p className="error">{t("Cannot decline counter offer.")}</p> : null}
                    </div>
            </div>
    </div>;
};
