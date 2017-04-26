import React from 'react';
import {connect} from 'react-redux';
import {LiveVideoFilter} from '../../../actions/ui';

const LiveGamesFilter = React.createClass({

    /**
     * @name setFilter
     * @description filter function live videos
     * @param filter
     * @returns {Function}
     * */
    setFilter (filter) {
        return () => {
            this.props.dispatch(LiveVideoFilter(filter));
        };
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        ownParams: ownParams,
        liveVideoFilter: state.persistentUIState.liveVideoFilter
    };
}

export default connect(mapStateToProps)(LiveGamesFilter);