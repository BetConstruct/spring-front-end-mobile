import React from 'react';
import Loader from "../../components/loader/";
import Region from './pices/region';
import TotalGames from './pices/totalGames';

module.exports = function PrematchCompetitionsTemplate () {
    console.debug("prematch competition this.props", this.props, this);

    let loading = !this.props.loaded;
    let data = this.props.data;

    if (data && data.region && data.region.length) {
        var sport = data,
            regions = data.region,
            Regions = regions.map(
                (region, index) => {
                    return <Region
                        key={region.id}
                        sport={sport}
                        regionId={region.id}
                        index={index}
                        toggleCompetitionToFavorite={this.props.toggleCompetitionToFavorite}
                        isCompetitionFavorite={this.props.isCompetitionFavorite}
                        swarmDataKey={this.props.swarmDataKey}/>;
                }
            );

        return (
            <div className={"select-sport-contain-m" + (loading ? " loading" : "")}>
                <div className={"select-sport-title-m " + (sport && sport.alias)}>
                    <h2>
                        <b>{sport && sport.name}</b>
                    </h2>
                <TotalGames dataSelector={this.props.dataSelector}/>
                </div>
                <div className="select-game-nav-list">
                    <ul>
                        {Regions}
                    </ul>
                </div>
            </div>
        );
    }
    return (
        <div className='sports'>
            <Loader/>
        </div>
    );

};
