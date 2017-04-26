import React from 'react';
import SportsList from "../../components/sportsList/";
import LiveGamesList from "../../components/liveGamesList/";
import LiveGamesFilter from "../../components/liveGamesFilter/";
import Favorites from "../favorites/";

module.exports = function liveTemplate () {
    return (
        <div className="import-view-container">
            <LiveGamesFilter/>
            <SportsList routeParams={this.props.routeParams} location={this.props.location} gameType="live" key={this.props.liveVideoFilter} videoFilter={this.props.liveVideoFilter}/>
            { (this.props.routeParams.sportAlias && this.props.routeParams.sportAlias !== "Favorites")
                ? <LiveGamesList
                    selectedSportAlias={this.props.routeParams.sportAlias}
                    key={"live" + this.props.routeParams.sportAlias + this.props.liveVideoFilter}
                    videoFilter={this.props.liveVideoFilter}
                />
                : null }

            {(this.props.routeParams.sportAlias && this.props.routeParams.sportAlias === "Favorites")
                ? <Favorites/>
            : null}
        </div>
    );
};
