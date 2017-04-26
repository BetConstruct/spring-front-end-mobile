import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import {Link} from 'react-router';
import Loader from "../loader/";
import Config from "../../../config/main";
import moment from "moment";
import {additionalMarketsCount} from "../../../helpers/sport/sportData";
import {niceEventName} from "../../../helpers/sport/eventNames";
import Event from "../event/";
import Expandable from "../../containers/expandable/";
import {t} from "../../../helpers/translator";

module.exports = function prematchGamesWidgetTemplate () {

    console.debug("prematchGamesWidgetTemplate:", this.props);
    let sportsGames;
    let sportsRowKeys = [];
    if (this.props.swarmData && this.props.swarmData.sport) {
        let Sports = Helpers.objectToArray(this.props.swarmData.sport).sort(Helpers.byOrderSortingFunc);
        sportsGames = Sports.map(
            (sport, index) => {
                let sportRowKey = "PW" + sport.id;
                sportsRowKeys.push(sportRowKey);
                return <div className="games-list-view-dashboard" key={sport.alias}>
                    <Expandable
                        className={`single-sport-title-dashboard-m ${sport.alias}`}
                        uiKey={sportRowKey}
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

                                    <div className="name-game-row-m">
                                        <Link to={`/prematch/game/${game.id}`}>
                                            <div className="game-title-info-row-m">
                                                <ul>
                                                    <li className="time-column-m">
                                                        <p>{moment.unix(game.start_ts).format(Config.main.timeFormat)}</p>
                                                    </li>
                                                    <li className="teams-name-column-m">
                                                        <div className="names-mini-row-m">
                                                            <ul>
                                                                <li className="title-team-name-view-m">
                                                                    <p>{game.team1_name}</p>
                                                                </li>
                                                                <li className="vs-team-view-m">
                                                                    { game.team2_name ? <p>vs</p> : null }
                                                                </li>
                                                                <li className="title-team-name-view-m">
                                                                    <p>{game.team2_name}</p>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                    <li className="market-count-view-m">
                                                        <p>{additionalMarketsCount(game)}</p>
                                                    </li>
                                                </ul>
                                                <div className="arrow-game-view-m"></div>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="coefficient-game-view">
                                        {Helpers.objectToArray(game.market).map(market =>
                                            <ul key={market.id}>
                                                {Helpers.objectToArray(market.event).sort(Helpers.byOrderSortingFunc).map(event =>
                                                    <li key={event.id}>
                                                        <Event event={event} price={event.price} name={niceEventName(event.name, game)} game={game} market={market}/>
                                                    </li>
                                                )}

                                            </ul>
                                        )}

                                    </div>

                                </li>
                            )}

                        </ul>
                    </div>
                </div>;
            }
        );
        sportsGames = sportsGames.length ? sportsGames : <div className="game-title-info-row-m"><p className="no-games-text-m">{t("No upcoming games in {1} mins", this.props.timeFilter)}</p></div>;
    }
    let timeFilter = <div className="time-filter-m">
        <ul>
            {Config.main.prematchWidgetTimeFilterValues.map(interval =>
                <li key={interval} onClick={this.setTimeFilter(interval)}
                    className={this.props.timeFilter === interval ? "active" : ""}>
                    <p>{interval} {t("mins")}</p>
                </li>
            )}
        </ul>
    </div>;

    return (

        <div className="dashboard-upcoming-game-list-m">
            <Expandable className="dashboard-column-title upcoming-view-m" uiKey="PW_parent"
                        childrenKeys={sportsRowKeys} initiallyExpanded={true}>
                <h3>{t("Upcoming")}</h3>
                <div className="collapse-arrow-view"></div>
            </Expandable>
            {timeFilter}
            {sportsGames || <Loader/>}

        </div>
    );
};
