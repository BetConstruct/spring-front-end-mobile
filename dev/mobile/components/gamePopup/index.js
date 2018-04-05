import React from 'react';
import {connect} from 'react-redux';
import {HandleOpenGameClick} from '../../../helpers/casino/helpers';
import PropTypes from 'prop-types';

const GamePopup = React.createClass({
    propTypes: {
        uiState: PropTypes.object,
        user: PropTypes.object
    },
    closeDialog (type) {
        let game = this.props.uiState.popupParams.game,
            authorized = this.props.user.loggedIn;

        HandleOpenGameClick.apply(this, [game, type, authorized]);
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

const mapStateToProps = (state, ownParams) => {
    return {
        user: state.user,
        uiState: state.uiState,
        ownParams: ownParams
    };
};

export default connect(mapStateToProps)(GamePopup);