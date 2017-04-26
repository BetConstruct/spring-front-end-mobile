import React from 'react';
import FavoriteGames from "../../components/favoriteGames/";
import FavoriteCompetitions from "../../components/favoriteCompetitions/";
import {t} from "../../../helpers/translator";

module.exports = function favoritesTemplate () {
    let favoritesCount = type => this.props.favorites[type] && Object.keys(this.props.favorites[type]).length;
    let allFavoritesCount = favoritesCount("game") + favoritesCount("competition");
    return (

        <div className="import-view-container">
            <div className="select-sport-title-m favorites">
                <h2><b>{t("Favorite")}</b></h2>
                { allFavoritesCount ? <span onClick={this.removeAll}><b>{t("Remove all")}</b></span> : null }
            </div>

            {allFavoritesCount
                ? [<FavoriteGames key={"favGames" + favoritesCount("game")}/>,
                    <FavoriteCompetitions key={"favComp" + favoritesCount("competition")}/>]
                : <div className="empty-text-wrapper-m">
                    <p>{t("You have no favorite games or competitions.")}</p>
                    <p>{t("You can make games or competitions favorite by clicking a star in a game or competition row.")}</p>
                  </div>
            }
        </div>
    );
};
