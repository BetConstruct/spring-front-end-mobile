import React from 'react';
import {connect} from 'react-redux';

const Prematch = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        prematchTimeFilter: state.persistentUIState.prematchTimeFilter
    };
}

export default connect(mapStateToProps)(Prematch);