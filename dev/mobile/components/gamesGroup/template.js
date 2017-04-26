import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import {additionalMarketsCount} from "../../../helpers/sport/sportData";
import {convertGameStateName} from "../../../helpers/sport/gameTimeNames";
import Config from "../../../config/main";
import Event from "../event/";
import {Link} from 'react-router';
import moment from 'moment';
import {hasVideo} from "../../../helpers/sport/videoFilter";
import {t} from "../../../helpers/translator";

module.exports = function gamesGroupTemplate () {
    var Games = Helpers.objectToArray(this.props.gamesObj).sort(Helpers.byStartTsSortingFunc).map(
        (game) => {
            let isLive = (this.props.gamesType === "live");
            // let gameHasXMarket = hasXMarket(game);
            // let gameHasP1P2Market = hasP1P2Market(game);
            return <div key={game.id} className="single-game-list-item-m">
                <div className="game-information-m">
                    <ul className={game.is_blocked ? "blocked" : ""}>
                        <li className={"teams-name-info-m" + (game.team2_name ? "" : " single-team")}>
                            <Link className={"game-info-mini-m " + (isLive ? "live" : "")} to={ `/${this.props.gamesType}/game/${game.id}` }>
                                <p><span className="team-name-m-box"><i>{game.team1_name}</i></span><span className="game-score-live-m">{isLive ? <i>{game.info && game.info.score1}</i> : null}</span></p>
                                {game.team2_name
                                    ? <p><span className="team-name-m-box"><i>{game.team2_name}</i></span><span className="game-score-live-m">{isLive ? <i>{game.info && game.info.score2}</i> : null}</span></p>
                                    : null
                                }
                                    <span className="time-markets-count-m">
                                            { isLive
                                                ? <span className="time-view-game-m">
                                                    <b className="b-row-view-m">{t(convertGameStateName(game.info && game.info.current_game_state, this.props.sportAlias))} {game.info && game.info.current_game_time}</b>
                                                    </span>
                                                : <i className="time-view-game-m">{moment.unix(game.start_ts).format(Config.main.timeFormat)}</i>
                                            }

                                            <i className="markets-count-view-m">{additionalMarketsCount(game)}</i>
                                            <span className="icons-game-info-m">
                                            {hasVideo(game) && game.is_started ? <i className="icon-separator-m video-icon" key="videoicon"/> : null}
                                            </span>
                                    </span>

                            </Link>
                        </li>
                        {(() => {
                            let market = Helpers.firstElement(game.market), eventsObj = market && market.event, events = {};
                            eventsObj && Object.keys(eventsObj).map(id => { events[eventsObj[id].type] = eventsObj[id]; }); // create events map with type as keys
                            return [
                                this.props.hasP1P2 ? <li className="factor-m" key="P1"><Event event={events.P1} price={events.P1 && events.P1.price} game={game} market={market}/></li> : null,
                                this.props.hasX ? <li className="factor-m" key="X"><Event event={events.X} price={events.X && events.X.price} game={game} market={market}/></li> : null,
                                this.props.hasP1P2 ? <li className="factor-m" key="P2"><Event event={events.P2} price={events.P2 && events.P2.price} game={game} market={market}/></li> : null
                            ];
                        })()}
                        <li className={"fav-game-icon-m" + (this.props.isGameFavorite(game.id) ? " active" : "")} onClick={this.props.toggleGameFavorite(game.id)} />
                    </ul>
                </div>
            </div>;
        }
    );
    return <div className="date-list-games-m">{Games}</div>;
};
