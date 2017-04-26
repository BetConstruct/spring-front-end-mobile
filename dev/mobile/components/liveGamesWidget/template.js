import React from 'react';
import {hasVideo} from "../../../helpers/sport/videoFilter";
import Helpers from "../../../helpers/helperFunctions";
import {Link} from 'react-router';
import Loader from "../loader/";
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";
import {convertGameStateName} from "../../../helpers/sport/gameTimeNames";

module.exports = function liveGamesWidgetTemplate () {

    console.debug("liveGamesWidgetTemplate:", this.props);

    if (this.props.data && this.props.data.sport) {
        var Sports = Helpers.objectToArray(this.props.data.sport).sort(Helpers.byOrderSortingFunc);
        var sportsRowKeys = [];
        var sportsGames = Sports.map(
            (sport, index) => {
                var rowKey = "LW" + sport.id;
                sportsRowKeys.push(rowKey);
                return <div className="games-list-view-dashboard" key={sport.alias}>
                    <Expandable
                        className={`single-sport-title-dashboard-m ${sport.alias}`}
                        uiKey={rowKey}
                        initiallyExpanded={index < 3}
                    >
                        <div className={"dashboard-sport-icon-m " + sport.alias}></div>
                        <h5>{sport.name}</h5>
                        <div className="closed-open-arrow-m"></div>
                    </Expandable>
                    <div className="single-sport-game-list-d">
                        <ul>
                            {Helpers.objectToArray(sport.game).sort(Helpers.byOrderSortingFunc).map(game =>
                                <li key={game.id}>
                                    <Link to={`/live/game/${game.id}`} className="live-game-info-m">
                                        <p className="date-game-icons-m">
                                            <span className="team-name-dashboard-b">
                                                {game.info && t(convertGameStateName(game.info.current_game_state, sport.alias))} {game.info && game.info.current_game_time}
                                            </span>
                                            <span className="icons-game-info-m">
                                                {hasVideo(game) && game.is_started ? <i className="icon-separator-m video-icon" key="videoicon"/> : null}
                                            </span>
                                        </p>

                                        <p className="game-teams-name-contain-m">
                                            <span className="mini-contain-name-separator">
                                                <span className="team-names-mini-w">
                                                    <b>{game.team1_name}</b>
                                                </span>
                                                <span className="game-count-b-m">
                                                    <i>{game.info && game.info.score1}</i>
                                                </span>
                                            </span>
                                            <span className="mini-contain-name-separator">
                                                <span className="team-names-mini-w">
                                                    <b>{game.team2_name}</b>
                                                </span>
                                                <span className="game-count-b-m">
                                                    <i>{game.info && game.info.score2}</i>
                                                </span>
                                            </span>
                                        </p>
                                        <p className="icon-arrow-single-game"/>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>;
            }
        );
        return (
            <div className="dashboard-live-game-list-m">
                <Expandable className="dashboard-column-title live-view-m" uiKey="LW_parent" childrenKeys={sportsRowKeys} initiallyExpanded={true}>
                    <h3>{t("Live now")}</h3>
                    <div className="collapse-arrow-view"></div>
                </Expandable>

                {sportsGames}

            </div>

        );
    }
    return <Loader/>;
};
