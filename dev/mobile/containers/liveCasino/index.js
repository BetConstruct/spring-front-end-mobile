import React from 'react';
import {connect} from 'react-redux';
import LiveCasinoMixin from '../../../mixins/liveCasinoMixin';

const LiveCasino = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        reallyLoggedIn: state.user.reallyLoggedIn,
        casino: state.casino
    };
}

export default connect(mapStateToProps)(LiveCasinoMixin({Component: LiveCasino}));