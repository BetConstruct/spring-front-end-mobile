import React from 'react';
import {SPORTS_HAVING_STATS_TABLE} from "../../constants/sportsInfo";
import {t} from "../../helpers/translator";

module.exports = function LiveGameStatstableTemplate () {
    var stats = this.props.stats || {};
    console.log("LiveGameStatstableTemplate", stats);

    return (
        SPORTS_HAVING_STATS_TABLE[this.props.sportAlias]
        ? <div className={'live-game-stats-table stats-' + this.props.sportAlias}>
            <table className="game-list-statistics back">
                <tr>
                    <th>&nbsp;</th>
                    <th><span className="ht" title={t("First time score")}><i>{t("HT")}</i></span></th>
                    <th><span className="y-card" title={t("Yellow card")}><i>{t("Yellow card")}</i></span></th>
                    <th><span className="r-card" title={t("Red card")}><i>{t("Red card")}</i></span></th>
                    <th><span className="corner" title={t("Corner")}><i>{t("Corner")}</i></span></th>
                    <th><span className="penalty" title={t("Penalty")}><i>{t("Penalty")}</i></span></th>
                    {stats.offside ? <th><span title={t("Offside")} className="icon-offside"><i>{t("Offside")}</i></span></th> : null}
                    {stats.substitution ? <th><span title={t("Substitution")} className="icon-substitution"><i>{t("Substitution")}</i></span></th> : null}
                    {stats.foul ? <th><span title={t("Foul")}>{t("Foul")}</span></th> : null}
                </tr>
                <tr>
                    <td>
                        <p>
                            <span/>
                            <b>{ this.props.team1_name || '' }</b>
                        </p>
                    </td>
                    <td>{(stats.score_set1 && stats.score_set1.team1_value) || 0}</td>
                    <td>{(stats.yellow_card && stats.yellow_card.team1_value) || 0 }</td>
                    <td>{(stats.red_card && stats.red_card.team1_value) || 0}</td>
                    <td>{(stats.corner && stats.corner.team1_value) || 0}</td>
                    <td>{(stats.penalty && stats.penalty.team1_value) || 0}</td>
                    {stats.offside ? <td>{ stats.offside.team1_value}</td> : null}
                    {stats.substitution ? <td>{ stats.substitution.team1_value}</td> : null}
                    {stats.foul ? <td>{ stats.foul.team1_value}</td> : null}
                </tr>
                <tr>
                    <td>
                        <p>
                            <span></span>
                            <b>{ this.props.team2_name || '' }</b>
                        </p>
                    </td>
                    <td>{(stats.score_set1 && stats.score_set1.team2_value) || 0}</td>
                    <td>{(stats.yellow_card && stats.yellow_card.team2_value) || 0}</td>
                    <td>{(stats.red_card && stats.red_card.team2_value) || 0}</td>
                    <td>{(stats.corner && stats.corner.team2_value) || 0}</td>
                    <td>{(stats.penalty && stats.penalty.team2_value) || 0}</td>
                    {stats.offside ? <td>{ stats.offside.team2_value}</td> : null}
                    {stats.substitution ? <td>{ stats.substitution.team2_value}</td> : null}
                    {stats.foul ? <td>{ stats.foul.team2_value}</td> : null}
                </tr>
            </table>
        </div>
        : null
    );
};
