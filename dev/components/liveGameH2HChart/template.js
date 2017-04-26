import React from 'react';
import {H2H_STATS_PER_SPORT} from "../../constants/sportsInfo";
import {t} from "../../helpers/translator";

module.exports = function LiveGameH2HChartTemplate () {
    // console.log("LiveGameStatsTemplate", this.props.stats);
    return (
        <div className={'live-game-stats stats-' + this.props.sportAlias}>
            {H2H_STATS_PER_SPORT[this.props.sportAlias] && this.props.stats
                ? Object.keys(H2H_STATS_PER_SPORT[this.props.sportAlias]).map(
                statName => {
                    var statsObj = this.props.stats[statName] || {team1_value: 0, team2_value: 0};
                    let v1 = statsObj.team1_value;
                    let v2 = statsObj.team2_value;
                    let width1 = (v1 + v2) === 0 ? 50 : ((v1 * 100) / (v1 + v2) + 0.1);
                    return <div className="statistic-view-m">
                        <p>{t(H2H_STATS_PER_SPORT[this.props.sportAlias][statName])}</p>
                        <div className="statistic-line-view"><span style={{width: width1 + "%"}}><i>{v1}</i></span>
                            <span><i>{v2}</i></span>
                        </div>
                    </div>;
                })
                : null}
        </div>
    );
};
