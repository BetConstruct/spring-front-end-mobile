import React from 'react';
import MatchOfTheDay from "../../components/matchOfTheDay/";
import LiveGamesWidget from "../../components/liveGamesWidget/";
import PrematchGamesWidget from "../../components/prematchGamesWidget/";

module.exports = function homeTemplate () {
    return (

        <div className="import-view-container">
            <div className="dashboard-wrapper-m">
                <MatchOfTheDay/>
                <LiveGamesWidget/>
                <PrematchGamesWidget key={this.props.prematchWidgetTimeFilter}/>

            </div>
        </div>
    );
};
