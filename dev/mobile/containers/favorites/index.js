import React from 'react';
import {connect} from 'react-redux';

import {SportsFavoritesClear} from "../../../actions/favorites";

const Favorites = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },
    removeAll () {
        this.props.dispatch(SportsFavoritesClear()); //eslint-disable-line react/prop-types
    }
});

function mapStateToProps (state) {
    return {
        favorites: state.favorites
    };
}
export default connect(mapStateToProps)(Favorites);