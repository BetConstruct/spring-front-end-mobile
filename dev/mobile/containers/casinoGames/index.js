import React from 'react';
import {connect} from 'react-redux';

const CasinoGames = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        user: state.user,
        swarmData: state.swarmData,
        ownParams: ownParams
    };
}

export default connect(mapStateToProps)(CasinoGames);