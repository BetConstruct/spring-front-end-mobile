import React from 'react';
import {connect} from 'react-redux';
import {checkIfUserIsLoggedIn} from "../../../mixins/checkAuthentication";

const Payments = React.createClass({
    render () {
        //eslint-disable-next-line react/prop-types
        return checkIfUserIsLoggedIn(this.props.user, this.props.dispatch) || Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        user: state.user,
        payments: state.payments,
        ownParams
    };
}

export default connect(mapStateToProps)(Payments);