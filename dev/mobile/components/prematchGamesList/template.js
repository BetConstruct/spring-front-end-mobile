import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import Loader from "../loader/";
import {hasXMarket, hasP1P2Market} from "../../../helpers/sport/sportData";
import Config from "../../../config/main";
import {Link} from 'react-router';
import GamesGroup from "../gamesGroup/";
import moment from 'moment';
import {t} from "../../../helpers/translator";

module.exports = function prematchGamesListTemplate () {
    // let key = "prematchGamesList" + this.props.routeParams.sportAlias + this.props.routeParams.regionAlias + this.props.routeParams.competitionId;
    let loading = !this.props.loaded;
    let data = this.props.data;
    let groupMarketTypes = {};

    /**
     * @name groupGamesByDate
     * @description get games , group games byt date
     * @param {Object} gamesObj
     * @returns {Object}
     * */
    function groupGamesByDate (gamesObj) {
        let groupObj = {};
        Helpers.objectToArray(gamesObj).map(
            game => {
                let day = moment.unix(game.start_ts).dayOfYear();
                groupObj[day] = groupObj[day] || {};
                groupObj[day][game.id] = game;
                groupMarketTypes[day] = groupMarketTypes[day] || {hasX: false, hasP1P2: false};
                groupMarketTypes[day].hasX = groupMarketTypes[day].hasX || hasXMarket(game);
                groupMarketTypes[day].hasP1P2 = groupMarketTypes[day].hasP1P2 || hasP1P2Market(game);
            }
        );
        return groupObj;
    }

    console.debug("prematch games list:", this.props);
    if (data && data.sport) {
        // var totalGames = GetSportGamesCount(data.sport);
        let Sport = Helpers.firstElement(data.sport),
            Region = Sport && Helpers.firstElement(Sport.region),
            Competition = Region && Helpers.firstElement(Region.competition),
            groupedGames = Competition && groupGamesByDate(Competition.game);

        return (
            <div className={"import-view-container" + (loading ? " loading" : "")}>
                {/*bread crumbs*/}
                <div className="bread-crumbs-view-m">
                    <Link to={`/prematch/${Sport.alias}`}>
                        <span className="back-arrow-crumbs"/>
                    </Link>
                    <p>
                        <span>{Sport.name}</span>
                        <span>/ {Region.name}</span>
                    </p>
                </div>
                <div className="league-name-view-m">
                    <h3>{Competition ? Competition.name : t("No games found")}</h3>
                </div>

                {/*Games list*/}
                <div className="date-list-games-m">
                    {groupedGames ? Object.keys(groupedGames).map(dayOfYear => +dayOfYear).sort((a, b) => a - b).map(
                        day => {
                            return [
                                <div className="game-date-view-m">
                                    <ul>
                                        <li><p>{moment().dayOfYear(day).format(Config.main.dateFormat)}</p></li>
                                        {groupMarketTypes[day].hasP1P2 ? <li>1</li> : null}
                                        {groupMarketTypes[day].hasX ? <li>X</li> : null}
                                        {groupMarketTypes[day].hasP1P2 ? <li>2</li> : null}
                                    </ul>
                                </div>,
                                <GamesGroup gamesType="prematch"
                                            gamesObj={groupedGames[day]}
                                            hasX={groupMarketTypes[day].hasX}
                                            hasP1P2={groupMarketTypes[day].hasP1P2}/>
                            ];
                        }
                    ) : null}
                </div>
                {/*Games list END*/}
            </div>
        );
    }
    return (
        <div className='sports'>
            <Loader/>
        </div>
    );
};
