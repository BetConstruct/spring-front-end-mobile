import React from 'react';
import {connect} from 'react-redux';
import {UserProfileUpdateReceived} from "../../../actions/user";
import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {GetProfile} from "../../../helpers/selectors";
import {UIMixin} from '../../../mixins/uiMixin';

const Balance = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },
    componentWillReceiveProps (nextProps) {
        console.debug("profile update", nextProps);
        let newProfileData = nextProps.profile;
        let oldProfileData = this.props.profile; //eslint-disable-line react/prop-types

        if (newProfileData && (!oldProfileData || (JSON.stringify(newProfileData) !== JSON.stringify(oldProfileData)))) {
            this.props.dispatch(UserProfileUpdateReceived(nextProps.profile));
        }
    }
});

function mapStateToProps (state) {
    return {
        preferences: state.preferences,
        profile: GetProfile(state),
        user: state.user
    };
}

export default connect(mapStateToProps)(SwarmDataMixin(
    {
        Component: UIMixin({Component: Balance}),
        ComponentWillMount: function () {
            this.swarmSubscriptionRequest = {
                "source": "user",
                "what": {"profile": []}
            };
            this.swarmDataKey = "profile";
        }
    }
));