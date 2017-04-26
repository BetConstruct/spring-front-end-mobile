import React from 'react';
import {connect} from 'react-redux';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {P1XP2MarketTypes} from "../../../helpers/sport/sportData";

const MatchOfTheDay = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        user: state.user,
        data: state.swarmData.data.promotedGame,
        loaded: state.swarmData.loaded.promotedGame,
        ownParams: ownParams
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: MatchOfTheDay,
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = {
                "source": "betting",
                "what": {
                    "sport": ["name", "alias"],
                    "game": ["id", "team1_name", "team2_name", "start_ts", "is_blocked"],
                    "market": ["name", "type", "id"],
                    "event": ["name", "type", "id", "price"]
                },
                "where": {
                    "sport": {"@limit": 1},
                    "market": {"type": {"@in": P1XP2MarketTypes}},
                    "event": {"type": {"@in": ["P1", "X", "P2"]}},
                    // "game": {"promoted": true, "@limit": 1},
                    "game": {
                        "@or": {
                            "promoted": true,
                            "markets_count": {"@gt": 50} // normally this shouldn't be here, but most of the time we don't have promoted games
                        },
                        "type": 1,
                        "@limit": 1
                    }
                }
            };
            this.swarmDataKey = "promotedGame";
        }
    }
));