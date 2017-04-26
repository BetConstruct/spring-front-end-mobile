import React from 'react';
import moment from "moment";
import Config from "../../config/main";
import {t} from "../../helpers/translator";
import {GAME_EVENTS_MAP} from "../../constants/gameAnimations";

module.exports = function gameAnimationTemplate () {
    console.log("game animation", this.props.game);
    var info = this.props.game.info || {};
    info.field = info.field || (this.props.game.field || '');
    let lastEvent = this.props.game.last_event || {};
    let lastEventName = GAME_EVENTS_MAP[lastEvent.type_id];
    let secondsSinceStart = moment().diff(moment(lastEvent.time_utc), "seconds");
    let side = this.props.game.last_event && this.props.game.last_event.side;

    let tennisAnimation = () => {
        let courtSide = "";
        if (this.props.game.stats && this.props.game.stats.passes) {
            var score1 = parseInt(this.props.game.stats.passes.team1_value, 10);
            var score2 = parseInt(this.props.game.stats.passes.team2_value, 10);
            var scoreSum = score1 + score2;
            if (lastEvent.set_score === "6:6" && scoreSum !== 0) {
                courtSide = (scoreSum % 2) === 0 ? "left" : "right";
            } else {
                if (score1 === score2 || scoreSum === 30 || scoreSum === 55) {
                    courtSide = "right";
                } else {
                    courtSide = "left";
                }
            }
        }
        let eventClasses = {
            "Ace": "set",
            "Point": "point_text",
            "ServiceFault": "fault_text",
            "DoubleFault": "fault_text",
            "Finished": "set",
            "FirstSet": "set",
            "SecondSet": "set",
            "ThirdSet": "set",
            "FourthSet": "set",
            "FifthSet": "set",
            "InjuryBreak": "set",
            "RainDelay": "set",
            "Timeout": "set"
        };
        return <div className={lastEventName + " side_" + side + " " + courtSide}>
            <div>
                {lastEventName === 'BallInPlay' || lastEventName === 'Ace'
                    ? <div className="ball_container">
                    <div className="ball"></div>
                    <div className="ball_shadow"></div>
                </div> : null}
                {lastEventName === 'Point'
                    ? [<div className="score_1"><span>{this.props.game.stats.passes.team1_value}</span></div>,
                    <div className="score_2"><span>{this.props.game.stats.passes.team2_value}</span></div>]
                    : null}
                {lastEventName !== "BallInPlay"
                    ? <div className={eventClasses[lastEventName]} title={t(lastEventName)}>{t(lastEventName)}</div>
                    : null}
            </div>
        </div>;
    };

    let soccerAnimation = () => {
        let homeOrAway = {"1": "home", "2": "away"}[side] || "";
        return [
            <div key="animation-container" className={`animation-container ${lastEventName} ${homeOrAway}`}>
                {lastEventName === 'Attack' || lastEventName === 'DangerousAttack' ? <div className=" attack-div"><div className="attack-dir"></div></div> : null}
                {lastEventName === 'BallSafe' ? <div><p title={t(lastEventName)}>{t(lastEventName)}</p><div>{this.props.game['team' + side + '_name']}</div></div> : null}
                {lastEventName === 'Corner' ? <div><div className=" ball"></div></div> : null}
                {lastEventName === 'FreeKick' || lastEventName === 'GoalKick' ? [<div className=" ripple"></div>, <div className="arrow"></div>, <div className="ball"></div>] : null}
                {lastEventName === 'Goal' ? <div className=" ball-cont"><div className="ball"></div></div> : null}
                {lastEventName === 'Offside' ? [<div className="line"></div>, <div className="ball"></div>] : null}
                {lastEventName === 'Penalty' ? [<div className="arrow"></div>, <div className="ball"></div>] : null}
                {lastEventName === 'RedCard' || lastEventName === 'YellowCard' ? <div className=" rotator"><div className="card"></div></div> : null}
                {lastEventName === 'Substitution' ? <div className=" sub-cont"></div> : null}
                {lastEventName === 'GoalkeeperSave' ? <div></div> : null}

                {lastEventName !== 'BallSafe' ? <p title={t(lastEventName)}>{t(lastEventName)}</p> : null}

                {lastEventName === 'Goal' ? <p className="team">{this.props.game['team' + side + '_name']}</p> : null}
                {lastEventName === 'ThrowIn' ? <div><div className="ball"></div></div> : null}
            </div>,
            <div key="gate-l" className="gate-l"></div>,
            <div key="gate-r" className="gate-r"></div>
        ];
    };

    let basketballAnimation = () => {
        let homeOrAway = {"1": "home", "2": "away"}[side] || "";
        return <div className={`animation-container ${lastEventName} ${homeOrAway} ${side}`}>
            <div>
                {lastEventName === 'FreeThrow' || lastEventName === 'Free1Throw' || lastEventName === 'Free2Throws' || lastEventName === 'Free2Throws' || lastEventName === 'Free3Throws'
                    ? [<div className="basket"></div>, <div className="arrow"></div>, <div className="b_ball"></div>] : null}
                {lastEventName === 'Attack' ? <div className="attack-div"><div className="attack-dir"></div></div> : null}
                {lastEventName === 'OnePoint' || lastEventName === 'TwoPoints' || lastEventName === 'ThreePoints'
                    ? [<div className="basket"></div>, <div className="ball_container"><div className="b_ball"></div></div>] : null}

                {lastEventName !== 'Foul' ? <div className="text-event" title={t(lastEventName)}>{t(lastEventName)}</div> : null}

                {lastEventName === 'Foul'
                    ? <div className="timeout-container"><div title={t(lastEventName)}>{t(lastEventName)}</div><div>{this.props.game.last_event.team_name}</div></div> : null}
            </div>
        </div>;
    };

    return (
        <div className={"game-control " + this.props.sport}>
            <div className="game-score-info-l-game">
                <ul>
                    <li>
                        <p className="team-name-live-game">{this.props.game.team1_name}</p>
                    </li>
                    <li className="game-score-column">
                        <div className="live-score-view">
                            <span className="score-1-view">{info.score1}</span>
                            <span className="icon-between-score"/>
                            <span className="score-2-view">{info.score2}</span>
                        </div>
                    </li>
                    <li>
                        <p className="team-name-live-game">{this.props.game.team2_name}</p>
                    </li>
                </ul>
            </div>
            <div className="game-animation-container">
                <div className="playing-field-contain">

                    <div className="animation-container">
                        <div className="field-container">
                            <div className={"field field-" + this.props.game.info.field}>
                                {lastEvent && secondsSinceStart < Config.main.animationDisplayTime
                                    ? (() => {
                                        switch (this.props.sport) {
                                            case "Soccer":
                                                return soccerAnimation();
                                            case "Basketball":
                                                return basketballAnimation();
                                            case "Tennis":
                                                return tennisAnimation();
                                            default:
                                                return <div className={"event-" + lastEventName + " side" + lastEvent.side}>
                                                    <p>{t(lastEventName)}</p>
                                                    <div className="animation-view"></div>
                                                </div>;
                                        }
                                    })()
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
