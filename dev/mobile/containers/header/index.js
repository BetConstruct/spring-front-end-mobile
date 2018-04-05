import React from 'react';
import {connect} from 'react-redux';
import {UIMixin} from '../../../mixins/uiMixin';
import {GetLoginState} from "../../../helpers/selectors";

const Header = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        loggedIn: GetLoginState(state),
        unreadCount: state.user && state.user.profile && state.user.profile.unread_count || 0,
        ownParams
    };
}

export default connect(mapStateToProps)(UIMixin({Component: Header}));