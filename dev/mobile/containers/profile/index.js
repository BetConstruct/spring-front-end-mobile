import React from 'react';
import {connect} from 'react-redux';
import {checkIfUserIsLoggedIn} from "../../../mixins/checkAuthentication";

const Profile = React.createClass({
    render () {
        //eslint-disable-next-line react/prop-types
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Profile);