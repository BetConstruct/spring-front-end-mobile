import React from 'react';
import {connect} from 'react-redux';
import {defaultMemoize, createSelector} from "reselect";
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import {CreateComponentSwarmDataSelector, CreateComponentSwarmLoadedStateSelector} from "../../../helpers/selectors";
import {P1XP2MarketTypes} from "../../../helpers/sport/sportData";
import moment from "moment";

const PrematchGamesList = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

let createSwarmDataKeySelector = defaultMemoize((sportAlias, regionAlias, competitionId, timeFilter) => () => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(sportAlias, regionAlias, competitionId, timeFilter, true)));

/**
 * @name getSwarmSubscriptionRequest
 * @description get swarm subscription request for corresponding sport alias, region and competition Id
 * @param {string} sportAlias
 * @param {string} regionAlias
 * @param {number} competitionId
 * @param {number} timeFilter
 * @param {boolean} isForHashing
 * @returns {object}
 * */
function getSwarmSubscriptionRequest (sportAlias, regionAlias, competitionId, timeFilter, isForHashing) {
    let req = {
        "source": "betting",
        "what": {
            "sport": [["name", "alias"]],
            "region": [["name", "alias", "order"]],
            "competition": ["name", "id", "order"],
            "game": [["id", "team1_name", "team2_name", "order", "start_ts", "markets_count", "is_blocked", "exclude_ids", "team1_reg_name", "team2_reg_name"]],
            "market": ["name", "type", "id", "express_id", "base", "display_key", "home_score", "away_score"],
            "event": ["name", "type", "id", "price", "order"]
        },
        "where": {
            "sport": {"alias": sportAlias},
            "region": {"alias": regionAlias},
            "competition": {"id": parseInt(competitionId, 10)},
            "game": {"@or": [{type: {"@in": [0, 2]}}, {visible_in_prematch: 1}]},
            "market": {"type": {"@in": P1XP2MarketTypes}},
            "event": {"type": {"@in": ["P1", "X", "P2"]}}
        }
    };
    if (timeFilter) {
        req.where.game = req.where.game || {};
        req.where.game.start_ts = {'@now': {'@gte': 0, '@lt': timeFilter === 'today' ? isForHashing ? 'today' : moment().endOf("day").unix() - moment().unix() : timeFilter * 3600}};
    }
    return req;
}

function mapStateToProps (state, ownParams) {
    let keySelector = createSwarmDataKeySelector(ownParams.routeParams.sportAlias, ownParams.routeParams.regionAlias, ownParams.routeParams.competitionId, state.persistentUIState.prematchTimeFilter, true);
    return createSelector(
        [
            CreateComponentSwarmDataSelector(keySelector),
            CreateComponentSwarmLoadedStateSelector(keySelector),
            state => state.persistentUIState.prematchTimeFilter
        ],
        (data, loaded, prematchTimeFilter) => ({data, loaded, prematchTimeFilter})
    );
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: PrematchGamesList,
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(this.props.routeParams.sportAlias, this.props.routeParams.regionAlias, this.props.routeParams.competitionId, this.props.prematchTimeFilter);
            this.swarmDataKey = getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(this.props.routeParams.sportAlias, this.props.routeParams.regionAlias, this.props.routeParams.competitionId, this.props.prematchTimeFilter, true));
            this.keepDataAfterUnsubscribe = true;
        }
    }
));