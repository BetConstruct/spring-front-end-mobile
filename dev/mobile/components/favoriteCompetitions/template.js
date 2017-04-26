import React from 'react';
import Loader from "../../components/loader/";
import Helpers from "../../../helpers/helperFunctions";
import {Link} from 'react-router';
import {t} from "../../../helpers/translator";

module.exports = function favoriteCompetitionsTemplate () {

    console.debug("favorite competitons data:", this.props.data);
    if (this.props.data && this.props.data.sport) {
        let Competitions = [];
        Object.keys(this.props.data.sport).map(
            sportId => Object.keys(this.props.data.sport[sportId].region).map(
                regionId => Object.keys(this.props.data.sport[sportId].region[regionId].competition).map(
                    competitionId => {
                        console.log(this.props.data.sport[sportId].region[regionId].competition[competitionId]);
                        this.props.data.sport[sportId].region[regionId].competition[competitionId].sportAlias = this.props.data.sport[sportId].alias;
                        this.props.data.sport[sportId].region[regionId].competition[competitionId].regionAlias = this.props.data.sport[sportId].region[regionId].alias;
                        Competitions.push(this.props.data.sport[sportId].region[regionId].competition[competitionId]);
                    }
                )
            )
        );

        return (
            <div className="favorite-games-view-m league-view">
                <div className="title-fave-container-m">
                    <h4>{t("Leagues")}</h4>
                </div>
                {Competitions.sort(Helpers.byOrderSortingFunc).map(
                    competititon => <Link
                        key={competititon.id}
                        to={`/prematch/${competititon.sportAlias}/${competititon.regionAlias}/${competititon.id}`}
                        className="single-sport-title-dashboard-m"
                    >
                        <span className={"dashboard-sport-icon-m " + competititon.sportAlias}/>
                        <h5>{competititon.name}</h5>
                        <span className="closed-open-arrow-m"/>
                    </Link>
                )}

            </div>
        );
    }
    return (
        <Loader/>
    );
};
