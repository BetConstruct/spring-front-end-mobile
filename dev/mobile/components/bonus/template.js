import React from 'react';
import {Link} from "react-router";
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import Expandable from "../../containers/expandable/";
import moment from "moment";
import Config from "../../../config/main";
import {BONUS_ACCEPTANCE_TYPE_NONE, BONUS_ACCEPTANCE_TYPE_ACCEPTED, BONUS_ACCEPTANCE_TYPE_ACTIVATED,
    BONUS_TYPE_WAGERING, BONUS_TYPE_FREEBET, bonusAcceptanceTypes} from "../../../constants/bonus";
function bonusTemplate () {
    // console.log("------------- bonus props", this.props);
    let key = this.props.type === "casino" ? "casinoBonuses" : "sportBonuses";
    let bonuses = this.props.swarmData.data[key] && this.props.swarmData.data[key].bonuses;
    if (this.props.swarmData.loaded[key] === false) {
        return <Loader/>;
    }
    let currencyId = this.props.user.profile && this.props.user.profile.currency_id && this.props.user.profile.currency_id.toLowerCase();
    return (
       <div className="bonus-page-wrapper">
           <div className="bonus-wrapper">
               { bonuses.map(bonus => {
                   let allowBonusCancelation = !!Config.main.bonus && !Config.main.bonus.disableBonusCanceling;
                   let canClaim = bonus.can_accept && bonus.acceptance_type === BONUS_ACCEPTANCE_TYPE_NONE &&
                       !this.props.ui.failReason["claimBonus" + bonus.partner_bonus_id] && !this.props.ui.loading["claimBonus" + bonus.partner_bonus_id];
                   let canCancel = allowBonusCancelation && bonus.bonus_type !== BONUS_TYPE_FREEBET &&
                       (bonus.acceptance_type === BONUS_ACCEPTANCE_TYPE_ACCEPTED || bonus.acceptance_type === BONUS_ACCEPTANCE_TYPE_ACTIVATED) &&
                       !this.props.ui.failReason["cancelBonus" + bonus.partner_bonus_id] && !this.props.ui.loading["cancelBonus" + bonus.partner_bonus_id];

                   return [
                       <div className="single-bonus-container">
                           <div className="bonus-title-view">
                               <h3>{bonus.name}</h3>
                           </div>
                           <div className="bonus-info-contain">
                               <ul>
                                   <li>
                                       <div className="bonus-icon-view"></div>
                                       {!this.props.ui.opened["bonus" + bonus.id] && canClaim ? <div className="claim-b">
                                           <button className="button-view-normal-m" onClick={this.claimBonus(bonus.partner_bonus_id)}>{t("Claim")}</button>
                                       </div> : null}
                                   </li>
                                   <li>
                                       <p className={"status-" + bonus.acceptance_type} >{t("Status:")} <span>{bonusAcceptanceTypes[bonus.acceptance_type]}</span></p>
                                       <p>{t("Time to Wager: {1} days", bonus.expiration_days)}</p>
                                       <p>{t("Wagering Req.: x{1}", bonus.wagering_factor)}</p>
                                       {!this.props.ui.opened["bonus" + bonus.id] ? <div className="more-bonus-info" onClick={this.props.uiOpen("bonus" + bonus.id)}>
                                            <span>{t("Read More")}</span>
                                        </div> : null}
                                   </li>
                               </ul>
                           </div>
                       </div>,
                       this.props.ui.opened["bonus" + bonus.id] ? <div className="bonus-expanded">
                     <div className="bonus-more-view-wrapper">
                       <Expandable className="title-info-bonus" uiKey={"aboutBonus" + bonus.id}>
                           <p>{t("About Bonus")}</p>
                           <span className="bonus-info-arrow"/>
                       </Expandable>
                       <div className="sub-info-contain">
                           <p>{bonus.description}</p>
                       </div>
                   </div>

                   <div className="bonus-more-view-wrapper">
                       <Expandable className="title-info-bonus" uiKey={"aboutBonus" + bonus.terms}>
                           <p>{t("Terms and Conditions")}</p>
                           <span className="bonus-info-arrow"/>
                       </Expandable>
                       <div className="sub-info-contain">
                           <p>
                           {bonus.acceptance_date ? <span>{t("Acceptance date:")} {moment.unix(bonus.acceptance_date).format(Config.main.dateTimeFormat)}</span> : null}
                           {bonus.start_date ? <span>{t("Start date:")} {moment.unix(bonus.start_date).format(Config.main.dateTimeFormat)}</span> : null}
                           {bonus.end_date ? <span>{t("End date:")} {moment.unix(bonus.end_date).format(Config.main.dateTimeFormat)}</span> : null}
                           {bonus.expiration_date ? <p>{t("Expiration date:")} {moment.unix(bonus.expiration_date).format(Config.main.dateTimeFormat)}</p> : null}
                           {bonus.client_bonus_expiration_date ? <spanp>{t("Client bonus expiration date:")} {moment.unix(bonus.client_bonus_expiration_date).format(Config.main.dateTimeFormat)}</spanp> : null}
                           { bonus.money_requirenments[currencyId]
                               ? <span>{t("Min/Max deposit:")} {bonus.money_requirenments[currencyId].min_amount} / {bonus.money_requirenments[currencyId].max_amount} {bonus.money_requirenments[currencyId].currency_id}</span>
                               : null}
                           </p>
                       </div>
                   </div>

                       {canClaim ? <div className="bonus-claim-button-w">
                            <div className="separator-box-buttons-m">
                                <button className="button-view-normal-m" onClick={this.claimBonus(bonus.partner_bonus_id)}>{t("Claim Bonus")}</button>
                            </div>
                        </div> : null}

                       {canCancel ? <div className="bonus-claim-button-w">
                                <div className="separator-box-buttons-m">
                                    <button className="button-view-normal-m cancel-b" onClick={this.cancelBonus(bonus.partner_bonus_id)}>{t("Cancel")}</button>
                                </div>
                            </div> : null}

                       {bonus.acceptance_type === BONUS_ACCEPTANCE_TYPE_ACCEPTED && bonus.bonus_type === BONUS_TYPE_WAGERING ? <div className="bonus-claim-button-w">
                           <span>{t("To activate bonus please do deposit")}</span>
                           <Link to="/balance/deposit">
                           <div className="separator-box-buttons-m">
                                <button className="button-view-normal-m">{t("Deposit")}</button>
                            </div>
                           </Link>
                        </div> : null}

               </div> : null]; }
               )}

           </div>
       </div>
    );
}
module.exports = bonusTemplate;

