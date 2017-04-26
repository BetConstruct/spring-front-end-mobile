import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {t} from "../../../../helpers/translator";
import {betHistoryItemSelector} from "../../../../helpers/selectors";
import {Link} from 'react-router';
import {BetslipTypes,
    BETSLIP_TYPE_SINGLE,
    BETSLIP_TYPE_EXPRESS,
    BETSLIP_TYPE_SYSTEM,
    BETSLIP_TYPE_CHAIN
} from "../../../../helpers/sport/betslip";
import {betOutcomes,
    BET_OUTCOME_ONHOLD,
    BET_OUTCOME_DECLINED,
    BET_OUTCOME_UNSETTLED,
    BET_OUTCOME_LOST,
    BET_OUTCOME_RETURNED,
    BET_OUTCOME_WON,
    BET_OUTCOME_CASHEDOUT
} from "../../../../constants/betHistory";
import moment from "moment";
import OddConverter from "../../../../helpers/sport/oddConverter";
import MoneyAmount from "../../../components/moneyAmount/";
import Config from "../../../../config/main";
import {UIMixin} from "../../../../mixins/uiMixin";

class HistoryBetItem extends React.Component {
    shouldComponentUpdate (nextProps) {
        let bet = this.props.bet, nextBet = nextProps.bet;
        return bet.cash_out !== nextBet.cash_out || bet.calculatedCashout !== nextBet.calculatedCashout || bet.cashoutSuspended !== nextBet.cashoutSuspended || this.props.preferences.oddsFormat !== nextProps.preferences.oddsFormat;
    }
    render () {
        let bet = this.props.bet;
        const betTypeCssClass = {
            [BETSLIP_TYPE_SINGLE]: "single",
            [BETSLIP_TYPE_EXPRESS]: "multiple",
            [BETSLIP_TYPE_SYSTEM]: "system",
            [BETSLIP_TYPE_CHAIN]: "chain"
        };
        const betOutcomeCssClass = {
            [BET_OUTCOME_ONHOLD]: "unsettled",
            [BET_OUTCOME_DECLINED]: "lost",
            [BET_OUTCOME_UNSETTLED]: "unsetteled",
            [BET_OUTCOME_LOST]: "lost",
            [BET_OUTCOME_RETURNED]: "lost",
            [BET_OUTCOME_WON]: 'won',
            [BET_OUTCOME_CASHEDOUT]: "unsettled"
        };

        return (
            <div className={"bet-coupon-view" + (bet.is_super_bet ? " super" : "") + (bet.client_bonus_id ? " bonus" : "")} key={bet.id}>
                <div className="top-row-info-bet">
                    <Link className="link-bet-all-info" to={`/history/bet/${bet.id}`}>
                        <span className={"bet-kind " + betTypeCssClass[bet.type]}/>
                        <p className="additional-information-bet">
                            <i>{t(BetslipTypes[bet.type])}</i>
                            <span className={"status-bet-coupon " + betOutcomeCssClass[bet.outcome]}>{t(betOutcomes[bet.outcome])}</span>
                        </p>
                        <p className="date-id-info-bet">
                            <span className="id-info-view">{t("ID:")} <b>{bet.id}</b></span>
                            <i>{moment.unix(bet.date_time).format(Config.main.shortDateTimeFormat)}</i>
                        </p>
                        <span className="arrow-view-bet-info"/>
                    </Link>
                </div>
                <div className="stake-odd-view-box">
                    {bet.bonus_bet_amount ? <p className="stake-container">
                        <b>{t("Bonus stake")}</b>
                        <span><MoneyAmount amount={bet.bonus_bet_amount}/></span>
                    </p> : null}
                    {bet.amount ? <p className="stake-container">
                        <b>{t("Stake")}</b>
                        <span><MoneyAmount amount={bet.amount}/></span>
                    </p> : null}
                    <p className="stake-container odd">
                        <b>{t("Odd")}</b>
                        <span>{OddConverter(bet.k, this.props.preferences.oddsFormat)}</span>
                    </p>
                </div>
                {bet.outcome === parseInt(BET_OUTCOME_WON, 10)
                    ? <div className="possible-win-coupon">
                    <p>{t("Won")}</p>
                    <span>
                                {bet.bonus
                                    ? <span className="win-b-result"><MoneyAmount amount={bet.payout - bet.bonus}/> + <b className="bonus-amount">{bet.bonus}</b></span>
                                    : <MoneyAmount amount={bet.payout}/>
                                }
                            </span>
                </div>
                    : <div className="possible-win-coupon">
                    <p>{t("Possible win")}</p>
                    <span>
                                {bet.bonus
                                    ? <span className="win-b-result"><MoneyAmount amount={bet.possible_win - bet.bonus}/> + <b className="bonus-amount">{bet.bonus}</b></span>
                                    : <MoneyAmount amount={bet.possible_win}/>
                                }
                            </span>
                </div>
                }

                {bet.cash_out && !bet.cashoutSuspended ? <div className="cash-out-button">
                    <button className="button-view-normal-m trans-m" onClick={this.props.openPopup("CashOutDialog", {betId: bet.id, price: bet.calculatedCashout || bet.cash_out})}>
                        <i>{t("Cashout")}</i>
                        <b><MoneyAmount amount={bet.calculatedCashout || bet.cash_out}/></b>
                    </button>
                </div> : null}

            </div>
        );
    }
}

HistoryBetItem.propTypes = {
    bet: PropTypes.object.isRequired,
    betId: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    preferences: PropTypes.object.isRequired,
    openPopup: PropTypes.func.isRequired,
    sliceFromSubscriptions: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownParams) => betHistoryItemSelector(state, ownParams);

export default connect(mapStateToProps)(UIMixin({
    Component: HistoryBetItem
}));