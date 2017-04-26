import React from 'react';
import Helpers from "../../../helpers/helperFunctions";
import {GetSportGamesCount, hasXMarket, hasP1P2Market} from "../../../helpers/sport/sportData";
import Loader from "../loader/";
import GamesGroup from "../gamesGroup/";
import {t} from "../../../helpers/translator";

module.exports = function liveGamesListTemplate () {
    let loading = !this.props.loaded;
    let data = this.props.data;
    let Sport, Regions;

    // console.debug("live games list:", this.props);
    if (data && data.sport) {
        let totalGames = GetSportGamesCount(data.sport);
        Sport = Helpers.firstElement(data.sport);
        Regions = Sport && Helpers.objectToArray(Sport.region).sort(Helpers.byOrderSortingFunc).map(
            (region) => Helpers.objectToArray(region.competition).sort(Helpers.byOrderSortingFunc).map(
                (competition) => {
                    let compMarketTypes = Object.keys(competition.game).reduce((acc, gameId) => {
                        acc.hasX = acc.hasX || hasXMarket(competition.game[gameId]);
                        acc.hasP1P2 = acc.hasP1P2 || hasP1P2Market(competition.game[gameId]);
                        return acc;
                    }, {hasX: false, hasP1P2: false});
                    return <div className="list-games-m">
                        <div className="game-date-view-m">
                            <ul>
                                <li><p className="live-game-competition-m"><span
                                    className={"flag-view-m icon-" + (region.alias && region.alias.toLowerCase().replace(/\s/g, ''))}/> {competition.name}
                                </p></li>
                                {compMarketTypes.hasP1P2 ? <li>1</li> : null}
                                {compMarketTypes.hasX ? <li>X</li> : null}
                                {compMarketTypes.hasP1P2 ? <li>2</li> : null}
                            </ul>
                        </div>
                        <GamesGroup gamesType="live"
                                    gamesObj={competition.game}
                                    sportAlias={this.props.selectedSportAlias}
                                    hasX={compMarketTypes.hasX}
                                    hasP1P2={compMarketTypes.hasP1P2}/>
                    </div>;
                }
            )
        );

        return (
            <div className={"import-view-container" + (loading ? " loading" : "")}>
                <div className="select-sport-contain-m">
                    <div className={"select-sport-title-m " + (Sport && Sport.alias)}>
                        <h2>
                            <b>{Sport && Sport.name}</b>
                        </h2>
                        <span>
                            <b>{t("{1} Matches", totalGames)} </b>
                        </span>
                    </div>
                </div>
                {!totalGames ? <p>{t("No games matching your criteria in the selected sport")}</p> : null}
                {Regions}
            </div>
        );
    }
    return <Loader/>;
};
