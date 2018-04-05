import React from 'react';
import {connect} from 'react-redux';
import FavoritesMixin from "../../../mixins/favoritesMixin";
import PropTypes from 'prop-types';

const GameMarkets = React.createClass({
    propTypes: {
        game: PropTypes.object.isRequired
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        partnerConfig: state.swarmConfigData.partner,
        favorites: state.favorites
    };
}

export default connect(mapStateToProps)(FavoritesMixin({Component: GameMarkets}));