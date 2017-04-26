import React from 'react';
import {connect} from 'react-redux';
import FavoritesMixin from "../../../mixins/favoritesMixin";

const GamesGroup = React.createClass({
    propTypes: {
        gamesObj: React.PropTypes.object,
        gamesType: React.PropTypes.string,
        sportAlias: React.PropTypes.string,
        hasX: React.PropTypes.bool,
        hasP1P2: React.PropTypes.bool
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