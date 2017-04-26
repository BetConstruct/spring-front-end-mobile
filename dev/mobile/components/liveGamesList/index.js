import React from 'react';
import {connect} from 'react-redux';
import {defaultMemoize} from "reselect";
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import {CreateComponentSwarmDataSelector, CreateComponentSwarmLoadedStateSelector} from "../../../helpers/selectors";
import {P1XP2MarketTypes} from "../../../helpers/sport/sportData";
import {getVideoFilterRequest} from "../../../helpers/sport/videoFilter";

const LiveGamesList = React.createClass({
    propTypes: {
        selectedSportAlias: React.PropTypes.string,
        videoFilter: React.PropTypes.string
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

let createSwarmDataKeySelector = defaultMemoize((selectedSportAlias, videoFilter) => () => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(selectedSportAlias, videoFilter)));

/**
 * @name getSwarmSubscriptionRequest
 * @description get swarm subscription request for corresponding sport alias
 * @param {string} selectedSportAlias
 * @param {string} videoFilter
 * @returns {object}
 * */
function getSwarmSubscriptionRequest (selectedSportAlias, videoFilter) {
    let req = {
        "source": "betting",
        "what": {
            "sport": [["name", "alias"]],
            "region": ["name", "alias", "order"],
            "competition": ["name", "id", "order"],
            "game": [["id", "type", "is_started", "team1_name", "team2_name", "order", "start_ts", "markets_count", "is_blocked", "info", "video_id", "tv_type", "exclude_ids"]],
            "market": ["name", "type", "id", "base", "express_id"],
            "event": ["name", "type", "id", "price", "order", "base"]
        },
        "where": {
            "game": {"type": 1},
            "sport": {"alias": selectedSportAlias},
            "market": {"type": {"@in": P1XP2MarketTypes}},
            "event": {"type": {"@in": ["P1", "X", "P2"]}}
        }
    };
    if (videoFilter && videoFilter !== 'all') {
        req.where.game['@or'] = getVideoFilterRequest();
    }
    return req;
}

function mapStateToProps (state, ownParams) {
    let keySelector = createSwarmDataKeySelector(ownParams.selectedSportAlias, ownParams.videoFilter);
    return {
        data: CreateComponentSwarmDataSelector(keySelector)(state),
        loaded: CreateComponentSwarmLoadedStateSelector(keySelector)(state)
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: LiveGamesList,
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(this.props.selectedSportAlias, this.props.videoFilter);
            this.keepDataAfterUnsubscribe = true;
        }
    }
));