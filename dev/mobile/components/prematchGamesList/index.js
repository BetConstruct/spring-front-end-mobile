import React from 'react';
import {connect} from 'react-redux';
import {defaultMemoize} from "reselect";
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import {CreateComponentSwarmDataSelector, CreateComponentSwarmLoadedStateSelector} from "../../../helpers/selectors";
import {P1XP2MarketTypes} from "../../../helpers/sport/sportData";

const PrematchGamesList = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

let createSwarmDataKeySelector = defaultMemoize((sportAlias, regionAlias, competitionId) => () => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(sportAlias, regionAlias, competitionId)));


/**
 * @name getSwarmSubscriptionRequest
 * @description get swarm subscription request for corresponding sport alias, region and competition Id
 * @param {string} sportAlias
 * @param {string} regionAlias
 * @param {number} competitionId
 * @returns {object}
 * */
function getSwarmSubscriptionRequest (sportAlias, regionAlias, competitionId) {
    return {
        "source": "betting",
        "what": {
            "sport": [["name", "alias"]],
            "region": [["name", "alias", "order"]],
            "competition": ["name", "id", "order"],
            "game": [["id", "team1_name", "team2_name", "order", "start_ts", "markets_count", "is_blocked", "exclude_ids"]],
            "market": ["name", "type", "id", "express_id", "base"],
            "event": ["name", "type", "id", "price", "order"]
        },
        "where": {
            "sport": {"alias": sportAlias},
            "region": {"alias": regionAlias},
            "competition": {"id": parseInt(competitionId, 10)},
            "market": {"type": {"@in": P1XP2MarketTypes}},
            "event": {"type": {"@in": ["P1", "X", "P2"]}}
        }
    };
}

function mapStateToProps (state, ownParams) {
    let keySelector = createSwarmDataKeySelector(ownParams.routeParams.sportAlias, ownParams.routeParams.regionAlias, ownParams.routeParams.competitionId);
    return {
        data: CreateComponentSwarmDataSelector(keySelector)(state),
        loaded: CreateComponentSwarmLoadedStateSelector(keySelector)(state)
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: PrematchGamesList,
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(this.props.routeParams.sportAlias, this.props.routeParams.regionAlias, this.props.routeParams.competitionId);
            this.keepDataAfterUnsubscribe = true;
        }
    }
));