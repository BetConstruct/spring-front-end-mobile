import React from 'react';
import {connect} from 'react-redux';
import FavoritesMixin from "../../../mixins/favoritesMixin";
import PropTypes from 'prop-types';

const GamesGroup = React.createClass({
    propTypes: {
        gamesObj: PropTypes.object,
        gamesType: PropTypes.string,
        sportAlias: PropTypes.string,
        hasX: PropTypes.bool,
        hasP1P2: PropTypes.bool
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        favorites: state.favorites
    };
}

export default connect(mapStateToProps)(FavoritesMixin({Component: GamesGroup}));