import React from 'react';
import {FavoriteAdd, FavoriteRemove} from "../actions/favorites";

/**
 * FavoritesMixin is a HOC(Higher Order Component) which adds possibility to check and toggle game/market/competition
 * favorite state. Favorite state is kept in store.  Corresponding store part is synced with local storage,
 * so it survives page reloads (closing browser then opening it again).
 *
 * To enable the functionality component should be "wrapped" by FavoritesMixin, i.e. you should use
 * FavoritesMixin({Component: YourComponent}) instead of just YourComponent.
 *
 * Also, store's "favorites" key should be connected to component via mapStateToProps as  "favorites: state.favorites"
 *
 * @param ComposedComponent
 * @constructor
 */
var FavoritesMixin = ComposedComponent => class FavoritesMixin extends React.Component {

    toggleCasinoGameFavorite (gameId, payload) {
        return () => {
            if (this.isCasinoGameFavorite(gameId)) {
                this.dispatch(FavoriteRemove("casinoGame", gameId));
            } else {
                this.dispatch(FavoriteAdd("casinoGame", gameId, payload));
            }
        };
    }

    toggleGameFavorite (gameId) {
        return () => {
            if (this.isGameFavorite(gameId)) {
                this.dispatch(FavoriteRemove("game", gameId));
            } else {
                this.dispatch(FavoriteAdd("game", gameId));
            }
        };
    }
    toggleMarketFavorite (mType) {
        return () => {
            if (this.isMarketFavorite(mType)) {
                this.dispatch(FavoriteRemove("marketType", mType));
            } else {
                this.dispatch(FavoriteAdd("marketType", mType));
            }
        };
    }

    toggleCompetitionToFavorite (competitionId) {
        return () => {
            if (this.isCompetitionFavorite(competitionId)) {
                this.dispatch(FavoriteRemove("competition", competitionId));
            } else {
                this.dispatch(FavoriteAdd("competition", competitionId));
            }
        };
    }

    isMarketFavorite (type) {
        return this.favorites.marketType[type];
    }

    isGameFavorite (gameId) {
        return this.favorites.game[gameId];
    }

    isCompetitionFavorite (competitionId) {
        return this.favorites.competition[competitionId];
    }

    isCasinoGameFavorite (gameId) {
        return this.favorites.casinoGame[gameId];
    }

    render () {
        return <ComposedComponent.Component {...this.props} {...this.state}
            toggleGameFavorite={this.toggleGameFavorite}
            toggleCompetitionToFavorite={this.toggleCompetitionToFavorite}
            toggleMarketFavorite={this.toggleMarketFavorite}
            toggleCasinoGameFavorite={this.toggleCasinoGameFavorite}
            isMarketFavorite={this.isMarketFavorite}
            isGameFavorite={this.isGameFavorite}
            isCompetitionFavorite={this.isCompetitionFavorite}
            isCasinoGameFavorite={this.isCasinoGameFavorite}

        />;
    }
};

export default FavoritesMixin;