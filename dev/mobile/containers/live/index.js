import React from 'react';
import {connect} from 'react-redux';

const Live = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        liveVideoFilter: state.persistentUIState.liveVideoFilter
    };
}

export default connect(mapStateToProps)(Live);