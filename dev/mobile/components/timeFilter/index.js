import React from 'react';
import {connect} from 'react-redux';
import {PrematchTimeFilter} from '../../../actions/ui';

const TimeFilter = React.createClass({

    /**
     * @name setTimeFilter
     * @description set time filter for prematch games
     * @param {Object} time
     * @returns {Function}
     * */
    setTimeFilter (time) {
        return () => {
            console.log(this.props);
            this.props.dispatch(PrematchTimeFilter(time));
        };
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        ownParams: ownParams,
        prematchTimeFilter: state.persistentUIState.prematchTimeFilter
    };
}

export default connect(mapStateToProps)(TimeFilter);