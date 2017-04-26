import React from 'react';
import {connect} from 'react-redux';
import {HandleOpenGameClick} from '../../../helpers/casino/helpers';
import {OpenPopup} from "../../../actions/ui";
import {GetLoginState} from "../../../helpers/selectors";

const CasinoSearchResults = React.createClass({
    propTypes: {
        clearSearch: React.PropTypes.func.isRequired
    },

    /**
     * @description function open casino game
     * @param {Object} game
     * @returns {undefined}
     * */
    openGame (game) {
        if (this.props.loggedIn) { //eslint-disable-line react/prop-types
            HandleOpenGameClick.apply(this, [game, 'real', true]);
        } else {
            this.props.dispatch(OpenPopup("LoginForm"));
        }
    },

    /**
     * @description function close search input and clear search info
     * @returns {undefined}
     * */
    closeSearch () {
        this.props.clearSearch();
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

const mapToStateProps = (state) => {
    return {
        results: state.swarmData.data.casinoSearchResults,
        loggedIn: GetLoginState(state)
    };
};

export default connect(mapToStateProps)(CasinoSearchResults);