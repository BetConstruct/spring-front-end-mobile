import React from 'react';
import Config from "../../../config/main";
import Helpers from "../../../helpers/helperFunctions";
import Loader from "../../components/loader/";
import {Link} from 'react-router';
import moment from 'moment';
import {hasVideo} from "../../../helpers/sport/videoFilter";
import {additionalMarketsCount} from "../../../helpers/sport/sportData";
import {convertGameStateName} from "../../../helpers/sport/gameTimeNames";
import {t} from "../../../helpers/translator";

let gameTypes = {0: "prematch", 1: "live", 2: "prematch"};

module.exports = function favoriteGamesTemplate () {

    console.debug("favorite games data:", this.props.data);
    if (this.props.data && this.props.data.sport) {
        let Games = [];
        Object.keys(this.props.data.sport).map(
            sportId => Object.keys(this.props.data.sport[sportId].game).map(
                gameId => {
                    this.props.data.sport[sportId].game[gameId].sportAlias = this.props.data.sport[sportId].alias;
                    Games.push(this.props.data.sport[sportId].game[gameId]);
                }
            )
        );
        return (<div className="favorite-games-view-m">
            <div className="title-fave-container-m">
                <h4>{t("Events")}</h4>
            </div>
            {Games.sort(Helpers.byStartTsSortingFunc).map(
                game => {
                    let isLive = game.type === 1;
                    // let gameHasXMarket = hasXMarket(game);
                    // let gameHasP1P2Market = hasP1P2Market(game);
                    return <div key={game.id} className="single-game-list-item-m">
                        <div className="game-information-m">
                            <ul className={game.is_blocked ? "blocked" : ""}>
                                <li className={"teams-name-info-m" + (game.team2_name ? "" : " single-team")}>
                                    <Link className={"game-info-mini-m " + game.sportAlias} to={`/${gameTypes[game.type]}/game/${game.id}`}>
                                        {/*<span className={"dashboard-sport-icon-m " + game.sportAlias}/>*/}
                                        <p><span className="team-name-m-box"><i>{game.team1_name}</i></span><span className="game-score-live-m">{isLive ? <i>{game.info.score1}</i> : null}</span></p>
                                        {game.team2_name
                                            ? <p><span className="team-name-m-box"><i>{game.team2_name}</i></span><span className="game-score-live-m">{isLive ? <i>{game.info.score2}</i> : null}</span></p>
                                            : null
                                        }
                                        <span className="time-markets-count-m">
                                            { isLive
                                                ? <span className="time-view-game-m">{t(convertGameStateName(game.info.current_game_state, game.sportAlias))}</span>
                                                : <i className="time-view-game-m">{moment.unix(game.start_ts).format(Config.main.timeFormat)}</i>
                                            }

                                            <i className="markets-count-view-m">{additionalMarketsCount(game)}</i>
                                            <span className="icons-game-info-m">
                                            {hasVideo(game) && game.is_started ? <i className="icon-separator-m video-icon" key="videoicon"/> : null}
                                            </span>
                                        </span>

                                    </Link>
                                </li>
                                <li className="fav-game-icon-m active" onClick={this.removeGame(game.id)}/>
                            </ul>
                        </div>
                    </div>;
                }
            )}
        </div>);
    }
    return (
        <Loader/>
    );
};
