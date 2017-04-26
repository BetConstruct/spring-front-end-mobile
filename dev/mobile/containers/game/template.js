import React from 'react';
import {Link} from 'react-router';
import {hasVideo} from "../../../helpers/sport/videoFilter";
import Loader from "../../components/loader/";
import GameMarkets from "../../components/gameMarkets/";
import GameInfo from "../../components/gameInfo/";
import AnimationsContainer from "../../components/animationsContainer/";
import Expandable from "../../containers/expandable/";
import LiveGameScore from "../../../components/liveGameScore/";
import LiveGameH2HChart from "../../../components/liveGameH2HChart/";
import LiveGameStatsTable from "../../../components/liveGameStatsTable/";
import LiveGameTimeline from "../../../components/liveGameTimeline/";
import {SPORTS_HAVING_TIMELINE, SPORTS_HAVING_STATS_TABLE, H2H_STATS_PER_SPORT, SPORTS_HAVING_ANIMATIONS} from "../../../constants/sportsInfo";

import {t} from "../../../helpers/translator";

module.exports = function GameTemplate () {
    console.log("single game this", this, this.props);
    let {data, Sport, Region, Competition, Game} = this.getGameInfo(this.props);
    if (data && data.sport) {
        if (!Sport) {
            return <div className="game-not-found">
                <p className="no-games-text-m">{t("Game not found")}</p>
                <Link to={(this.props.routes && this.props.routes[1] && this.props.routes[1].path === "prematch") ? "/prematch" : "/live"}
                      className="no-games-text-m"
                >
                    {t("Back to list")}
                </Link>
            </div>;
        }
        var GameType = {0: "prematch", 1: "live", 2: "prematch"};

        let hasH2H = !!H2H_STATS_PER_SPORT[Sport.alias];
        let hasStats = !!SPORTS_HAVING_STATS_TABLE[Sport.alias];
        let hasTL = !!SPORTS_HAVING_TIMELINE[Sport.alias];
        return (
            <div className="import-view-container">

                {/*bread crumbs*/}
                <div className="import-view-container">
                    {this.props.uiState.previousPath.match(/.*\/Favorites/)
                    ? <div className="bread-crumbs-view-m favorites">
                            <Link to={`/${GameType[Game.type]}/Favorites`}>
                                <span className="back-arrow-crumbs"/>
                            </Link>
                            <p>{t("Favorites")}</p>
                            </div>
                    : <div className="bread-crumbs-view-m">
                        <Link to={`/${GameType[Game.type]}/${Sport.alias}` + (GameType[Game.type] === "prematch" ? `/${Region.alias}/${Competition.id}` : '')}>
                            <span className="back-arrow-crumbs"/>
                        </Link>
                        <p>
                            <span>{Sport.name}</span>
                            <span>/ {Region.name}</span>
                            <span>/ {Competition.name}</span>
                        </p>
                    </div>}
                </div>
                {/*bread crumbs END*/}

                {Game.type !== 1 ? <div className="league-name-view-m">
                    <h3>{Game.team1_name} {Game.team2_name ? " - " + Game.team2_name : ""}</h3>
                </div> : null}

                <AnimationsContainer
                    loggedIn={this.props.user.loggedIn}
                    balance={this.props.balance}
                    hasVideo={hasVideo(Game)}
                    videoLoadStarted={this.videoDataLoading}
                    hasAnimation={Game.type === 1 && SPORTS_HAVING_ANIMATIONS[Sport.alias]}
                    game={Game}
                    sport={Sport}
                    streamURL={this.videoData}/>

                    {Game.type === 1
                        ? <div className="animation-stat-tabs">
                            <Expandable className={"view-game-additional-info " + ((hasH2H + hasStats + hasTL) === 0 ? "one" : "")} uiKey="gi_score" initiallyExpanded={true}>{t("Score")}</Expandable>
                            {hasH2H ? <Expandable className="view-game-additional-info" uiKey="gi_h2h" initiallyExpanded={true}>{t("H2H Chart")}</Expandable> : null}
                            {hasStats ? <Expandable className="view-game-additional-info" uiKey="gi_stats" initiallyExpanded={true}>{t("Stats")}</Expandable> : null}
                            {hasTL ? <Expandable className="view-game-additional-info" uiKey="gi_timeline" initiallyExpanded={true}>{t("Timeline")}</Expandable> : null}
                        </div> : null}

                {Game.type === 1 && this.props.ui.expanded.gi_score !== false ? <LiveGameScore game={Game} sportAlias={Sport.alias}/> : null}
                {Game.type === 1 && this.props.ui.expanded.gi_h2h !== false ? <LiveGameH2HChart stats={Game.stats} sportAlias={Sport.alias}/> : null}
                {Game.type === 1 && this.props.ui.expanded.gi_stats !== false ? <LiveGameStatsTable stats={Game.stats} team1_name={Game.team1_name} team2_name={Game.team2_name} sportAlias={Sport.alias}/> : null}
                {Game.type === 1 && this.props.ui.expanded.gi_timeline !== false ? <LiveGameTimeline game={Game} sportAlias={Sport.alias}/> : null}
                {Game.type !== 1 ? <GameInfo game={Game} language={this.props.preferences.lang}/> : null}
                {Game.text_info
                    ? <div className="game-view-title-contain-m additional-info"><p className="additional-game-info">{Game.text_info}</p></div>
                    : null}
                <GameMarkets game={Game} favorites={this.props.favorites}/>

            </div>
        );
    }
    return (
        <div className='sports'>
            <Loader/>
        </div>
    );
};
