import React from 'react';
// import {Link} from 'react-router';
import SportsList from "../../components/sportsList/";
import TimeFilter from "../../components/timeFilter/";
import PrematchCompetitions from "../prematchCompetitions/";
import Favorites from "../favorites/";

module.exports = function preMatchTemplate () {
    console.log("prematch this.props", this.props);
    return (
        <div className="import-view-container">
            <TimeFilter/>
            <SportsList routeParams={this.props.routeParams} location={this.props.location} gameType="prematch" key={this.props.prematchTimeFilter} timeFilter={this.props.prematchTimeFilter}/>
            { (this.props.routeParams.sportAlias && this.props.routeParams.sportAlias !== "Favorites")
                ? <PrematchCompetitions
                    selectedSportAlias={this.props.routeParams.sportAlias}
                    key={this.props.routeParams.sportAlias + this.props.prematchTimeFilter}
                    timeFilter={this.props.prematchTimeFilter}
                  />
                : null
            }
            {(this.props.routeParams.sportAlias && this.props.routeParams.sportAlias === "Favorites")
                ? <Favorites/>
                : null}
        </div>
    );
};
