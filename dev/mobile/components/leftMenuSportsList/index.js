import React from 'react';
import {connect} from 'react-redux';
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {UIMixin} from '../../../mixins/uiMixin';
import {GetLeftMenuData} from '../../../helpers/selectors';
import {SCROLL_TO_SPORT_ALIAS} from '../../../actions/actionTypes';

class LeftMenuSportsList extends React.PureComponent {

    /**
     * @name handleSportItemClick
     * @description sport item click handler which is getting current sport data
     * @param {object} payload
     * @returns {undefined}
     * */
    handleSportItemClick (payload) {
        this.props.dispatch(
            {
                type: SCROLL_TO_SPORT_ALIAS,
                payload
            }
        );
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

LeftMenuSportsList.propTypes = {
    isInLive: React.PropTypes.bool
};

LeftMenuSportsList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

function mapStateToProps (state) {
    return GetLeftMenuData(state);
}

var gameTypeCondition = {
    true: {"type": 1},
    false: {"@or": [{"type": {"@in": [0, 2]}}, {"visible_in_prematch": 1}]}
};

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: UIMixin({Component: LeftMenuSportsList}),
        ComponentWillMount: function () {

            this.swarmSubscriptionRequest = {
                "source": "betting",
                "what": {"sport": ["id", "name", "alias", "order"]},
                "where": {"game": gameTypeCondition[this.props.isInLive]}
            };
            this.swarmDataKey = "leftMenuSportsList";
        },
        ComponentWillReceiveProps: function (nextProps) {
            if (this.props.isInLive !== nextProps.isInLive) {
                this.swarmSubscriptionRequest.where.game = gameTypeCondition[nextProps.isInLive];
                this.resubscribe();
            }
        }
    }
));