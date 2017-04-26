import React from 'react';
import {connect} from 'react-redux';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {FavoriteRemove} from "../../../actions/favorites";

const FavoriteCompetitions = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        favorites: state.favorites,
        data: state.swarmData.loaded.favoriteCompetitions && state.swarmData.data.favoriteCompetitions
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: FavoriteCompetitions,
        ComponentWillMount: function () {
            this.initialLoadCallback = function removeFinishedFavoriteCompetitions (resp) {
                let availableCompetitionIds = {};
                Object.keys(resp.sport).map(
                    sportId => Object.keys(resp.sport[sportId].region).map(
                        regionId => Object.keys(resp.sport[sportId].region[regionId].competition).map(
                            compId => { availableCompetitionIds[compId] = true; }
                        )
                    )
                );
                Object.keys(this.props.favorites.competition).map(id => { availableCompetitionIds[id] || this.props.dispatch(FavoriteRemove("competition", id)); });
            };
            this.swarmSubscriptionRequest = {
                "source": "betting",
                "what": {
                    "sport": ["name", "alias"],
                    "region": ["name", "alias"],
                    "competition": ["name", "id", "order"]
                },
                "where": {
                    "competition": {
                        "id": {"@in": Object.keys(this.props.favorites.competition).map(id => parseInt(id, 10))}
                    }
                }
            };
            this.swarmDataKey = "favoriteCompetitions";
        }
    }
));