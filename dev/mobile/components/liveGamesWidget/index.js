import React from 'react';
import {connect} from 'react-redux';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {P1XP2MarketTypes} from "../../../helpers/sport/sportData";

const LiveGamesWidget = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        data: state.swarmData.loaded.liveGamesWidget && state.swarmData.data.liveGamesWidget
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: LiveGamesWidget,
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = {
                "source": "betting",
                "what": {
                    "sport": ["name", "alias", "id", "order"],
                    "game": [["id", "team1_name", "team2_name", "order", "start_ts", "markets_count", "is_blocked", "video_id", "tv_type", "info"]],
                    "market": ["name", "type", "id"],
                    "event": ["name", "type", "id", "price"]
                },
                "where": {
                    "game": {"type": 1},
                    "market": {"type": {"@in": P1XP2MarketTypes}},
                    "event": {"type": {"@in": ["P1", "X", "P2"]}}
                }
            };
            this.swarmDataKey = "liveGamesWidget";
        }
    }
));