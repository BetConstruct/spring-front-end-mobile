import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {SwarmDataMixin, getSwarmDataKeyForRequest} from '../../../mixins/swarmDataMixin';
import {CreateComponentSwarmDataSelector} from "../../../helpers/selectors";
import {PrematchWidgetTimeFilter} from '../../../actions/ui';
import {P1XP2MarketTypes} from "../../../helpers/sport/sportData";

const PrematchGamesWidget = React.createClass({

    /**
     * @name setTimeFilter
     * @description set time filter for prematch games
     * @param {Object} time
     * @returns {Function}
     * */
    setTimeFilter (time) {
        return () => {
            this.props.dispatch(PrematchWidgetTimeFilter(time)); //eslint-disable-line react/prop-types
        };
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

let getTimeFilterValue = state => state.persistentUIState.prematchWidgetTimeFilter;
let getSwarmDataKey = createSelector(getTimeFilterValue, timeFilter => getSwarmDataKeyForRequest(getSwarmSubscriptionRequest(timeFilter)));

function mapStateToProps (state, ownParams) {
    return {
        user: state.user,
        swarmData: CreateComponentSwarmDataSelector(getSwarmDataKey)(state),
        timeFilter: getTimeFilterValue(state),
        ownParams: ownParams
    };
}

/**
 * @name getSwarmSubscriptionRequest
 * @description get swarm subscription request for corresponding time filter value
 * @param {number} timeFilterValue
 * @returns {object}
 * */
function getSwarmSubscriptionRequest (timeFilterValue) {
    let request = {
        "source": "betting",
        "what": {
            "sport": ["name", "alias", "id", "order"],
            "game": [["id", "team1_name", "team2_name", "order", "start_ts", "markets_count", "is_blocked", "info", "exclude_ids"]],
            "market": ["name", "type", "id", "base", "express_id"],
            "event": ["name", "type", "id", "price", "base"]
        },
        "where": {
            "game": {"@or": [{"type": {"@in": [0, 2]}}, {"visible_in_prematch": 1}]},
            "market": {"type": {"@in": P1XP2MarketTypes}},
            "event": {"type": {"@in": ["P1", "X", "P2"]}}
        }
    };
    request.where.game.start_ts = {'@now': {'@gte': 0, '@lt': timeFilterValue * 60}};
    return request;
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: PrematchGamesWidget,
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = getSwarmSubscriptionRequest(this.props.timeFilter);
        }
    }
));