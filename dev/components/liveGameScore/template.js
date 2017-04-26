import React from 'react';
import Config from "../../config/main";
import {t} from "../../helpers/translator";
import {framesCount} from "../../helpers/sport/gameInfo";
import {convertGameStateName} from "../../helpers/sport/gameTimeNames";

module.exports = function LiveGameScoreTemplate () {
    console.log("LiveGameScoreTemplate", this.props);
    var scoreFramesCount = framesCount(this.props.game.stats);
    var isEsportGame = Config.main.esportsGames.indexOf(this.props.sportAlias) !== -1;
    let getLogoUrl = (team) => (Config.main.teamLogosPath + "e/m/" + Math.floor(this.props.game[`team${team}_id`] / 2000) + "/" + this.props.game[`team${team}_id`] + ".png");
    let genericTemplate = () => <div className="game-statistic-view">
            <table>
                <tr>
                    <td></td>
                    {scoreFramesCount.map(frame => <td>{frame}</td>)}
                    <td>{convertGameStateName(this.props.sportAlias + "set")}</td>
                    {this.props.sportAlias === "Tennis" ? <td>{t("Points")}</td> : null}
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><p className="name-wrapper-s"><b className="team-name-statistic">{this.props.game.team1_name}</b></p></td>
                    {scoreFramesCount.map(frame => <td>{this.props.game.stats["score_set" + frame].team1_value || 0}</td>)}
                    <td>{t(this.props.game.info.score1 || '')}</td>
                    {this.props.sportAlias === "Tennis" ? <td>{this.props.game.stats.passes.team1_value || 0}</td> : null}
                    <td className={"pass" + (this.props.game.info.pass_team === 'team1' ? " active" : "")}>
                        <b className={"mini-icon " + this.props.sportAlias}/>
                    </td>
                </tr>
                <tr>
                    <td><p className="name-wrapper-s"><b className="team-name-statistic">{this.props.game.team2_name}</b></p></td>
                    {scoreFramesCount.map(frame => <td>{this.props.game.stats["score_set" + frame].team2_value || 0}</td>)}
                    <td>{t(this.props.game.info.score2 || '')}</td>
                    {this.props.sportAlias === "Tennis" ? <td>{this.props.game.stats.passes.team2_value || 0}</td> : null}
                    <td className={"pass" + (this.props.game.info.pass_team === 'team2' ? " active" : "")}>
                        <b className={"mini-icon " + this.props.sportAlias}/>
                    </td>
                </tr>
        </table>
    </div>;

    let singleScoreTemplate = () => <div className="game-score-view">
            <ul>
                <li className="team-name-statistic-view">
                    <p>
                        <span className="team-name-score-v"><i>{this.props.game.team1_name}</i></span>
                        <b>{isEsportGame ? <img src={getLogoUrl(1)}/> : null}</b>
                    </p>
                </li>
                <li className="draw-column-view"><p>{this.props.game.info.score1} : {this.props.game.info.score2}</p></li>
                <li className="team-name-statistic-view">
                    <p>
                        <b>{isEsportGame ? <img src={getLogoUrl(2)}/> : null}</b>
                        <span className="team-name-score-v"><i>{this.props.game.team2_name}</i></span>
                    </p>
                </li>
            </ul>
        </div>;

    let horseRacingTemplate = () => <table></table>;

    return (
        this.props.game.show_type !== 'OUTRIGHT'
            ? <div className={'live-game-score score-' + this.props.sportAlias}>
            {(() => {
                switch (this.props.sportAlias) {
                    case "CyberFootball":
                    case "Soccer":
                    case "CounterStrike":
                        return singleScoreTemplate();
                    case "HorseRacing":
                        return horseRacingTemplate();
                    default:
                        return genericTemplate();
                }
            })()}
        </div>
            : null
    );
};
