import React from 'react';
import moment from "moment";
import {Link, browserHistory} from "react-router";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";
import OddConverter from "../../../helpers/sport/oddConverter";
import Loader from "../../components/loader/";
import MoneyAmount from "../../components/moneyAmount/";
import {BET_OUTCOME_ONHOLD, BET_OUTCOME_DECLINED, BET_OUTCOME_UNSETTLED, BET_OUTCOME_LOST,
BET_OUTCOME_RETURNED, BET_OUTCOME_WON, BET_OUTCOME_CASHEDOUT} from "../../../constants/betHistory";
import {BetslipTypes} from "../../../helpers/sport/betslip";

module.exports = function betDetailsTemplate () {

    const betOutcomeCssClass = {
        [BET_OUTCOME_ONHOLD]: "waiting-icon",
        [BET_OUTCOME_DECLINED]: "lost-icon",
        [BET_OUTCOME_UNSETTLED]: "waiting-icon",
        [BET_OUTCOME_LOST]: "lost-icon",
        [BET_OUTCOME_RETURNED]: "returned-icon",
        [BET_OUTCOME_WON]: 'won-icon',
        [BET_OUTCOME_CASHEDOUT]: ""
    };

    let bet = this.selectedBet;

    console.debug("bet details ----", this.props, bet);
    if (!this.selectedBet) {
        return <Loader/>;
    }
    return (
        <div className="bet-details">
          <div className="bread-crumbs-view-m">
            <a onClick={browserHistory.goBack}>
                <span className="back-arrow-crumbs"/>
            </a>
            <p>
                <span>{t(BetslipTypes[bet.type])}</span><span>/</span>
                <span>{moment.unix(bet.date_time).format(Config.main.dateTimeFormat)}</span>
            </p>
            </div>
        <div className="bet-id-details">
                <h2><span>{t("ID:")}</span> <i>{bet.id}</i></h2>
            </div>

            <div className="bet-stake-odd-view">
                <div className="odd-stake-info-m">
                    <p className="bet-info-text-r">
                        <i>{t("Stake")}</i>
                        <span className="stake-count-m"><MoneyAmount amount={bet.amount} currency={bet.currency}/></span>
                    </p>
                    <p className="bet-info-text-r">
                        <i>{t("Odd")}</i>
                        <span className="odd-count-m">{OddConverter(bet.k, this.props.preferences.oddsFormat)}</span>
                    </p>
                </div>
                {bet.outcome === parseInt(BET_OUTCOME_WON, 10)
                    ? <div className="bet-won-info-m">
                        <p className="bet-info-text-r">
                            <i>{t("Won")}</i>
                            <span className="won-count-m">
                                {bet.bonus
                                    ? <span className="win-b-result"><MoneyAmount amount={bet.payout - bet.bonus}/> + <b className="bonus-amount">{bet.bonus}</b></span>
                                    : <MoneyAmount amount={bet.payout}/>
                                }
                            </span>
                        </p>
                    </div>
                    : <div className="bet-won-info-m">
                        <p className="bet-info-text-r">
                            <i>{t("Possible win")}</i>
                            <span className="won-count-m">
                                {bet.bonus
                                    ? <span className="win-b-result"><MoneyAmount amount={bet.possible_win - bet.bonus}/> + <b className="bonus-amount">{bet.bonus}</b></span>
                                    : <MoneyAmount amount={bet.possible_win}/>
                                }
                            </span>
                        </p>
                    </div>}
            </div>

            <div className="bet-id-details">
                <h2><span>{t("Events")}</span></h2>
            </div>
            {bet.events.map((event, i) =>
                <div className="single-event-info-m" key={i}>
                    <div className="team-names-info-m">
                        <Link to={(bet.outcome === parseInt(BET_OUTCOME_UNSETTLED, 10) && event.game_id) ? `/game/${event.game_id}` : null}>
                            <ul>
                                <li>
                                    <p className="team-info-name">{event.team1}</p>
                                </li>
                                <li>
                                    <p className="team-info-name">{event.team2}</p>
                                </li>
                            </ul>
                        </Link>
                        <div className={"event-status-icon " + betOutcomeCssClass[event.outcome]}></div>
                    </div>
                    <div className="sport-league-n-date">
                        <span className={"dashboard-sport-icon-m " + event.sport_index}/>
                        <p>
                        <span className="league-name-event">
                            <i>{event.competition_name}</i>
                        </span>
                        <span className="date-event-view">
                            <b>{moment.unix(event.game_start_date).format(Config.main.dateTimeFormat)}</b>
                        </span>
                        </p>
                    </div>

                    <div className="market-n-pick-info">
                        <h4>{event.market_name}</h4>
                        <p>
                        <span className="pick-title-info-m">
                            <b>{t("Pick:")}</b> <i>{event.event_name}</i>
                        </span>
                            <span className="odd-info-game">{event.coeficient}</span>
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
};
