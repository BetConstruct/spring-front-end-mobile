import React from 'react';
import {connect} from 'react-redux';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {FavoriteRemove} from "../../../actions/favorites";

const FavoriteGames = React.createClass({

    /**
     * @name removeGame
     * @description removing corresponding game from favoriteGames
     * @param {number} id
     * @returns {Function}
     * */
    removeGame (id) {
        return () => { this.props.dispatch(FavoriteRemove("game", id)); };
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        favorites: state.favorites,
        data: state.swarmData.data.favoriteGames
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: FavoriteGames,
        ComponentWillMount: function () {
            this.initialLoadCallback = function removeFinishedFavoriteGames (resp) {
                let availableGameIds = {};
                Object.keys(resp.sport).map(sportId => Object.keys(resp.sport[sportId].game).map(gameId => { availableGameIds[gameId] = true; }));
                Object.keys(this.props.favorites.game).map(id => { availableGameIds[id] || this.props.dispatch(FavoriteRemove("game", id)); });
            };
            this.swarmSubscriptionRequest = {
                "source": "betting",
                "what": {
                    "sport": ["name", "alias"],
                    "game": ["id", "team1_name", "team2_name", "start_ts", "markets_count", "type", "info", "is_started"]
                },
                "where": {
                    "game": {
                        "id": {"@in": Object.keys(this.props.favorites.game).map(id => parseInt(id, 10))}
                    }
                }
            };
            this.keepDataAfterUnsubscribe = true;
            this.swarmDataKey = "favoriteGames";
        }
    }
));