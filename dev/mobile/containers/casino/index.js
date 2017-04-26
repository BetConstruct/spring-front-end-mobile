import React from 'react';
import {connect} from 'react-redux';
import FavoritesMixin from "../../../mixins/favoritesMixin";
import CasinoMixin from "../../../mixins/casinoMixin";

const Casino = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        loggedIn: state.user.loggedIn,
        casino: state.casino,
        persistentUIState: state.persistentUIState,
        favorites: state.favorites
    };
}

export default connect(mapStateToProps)(FavoritesMixin({Component: CasinoMixin({
    Component: Casino
})}));