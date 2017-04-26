import React from 'react';
import {connect} from 'react-redux';
import {PreferencesSet} from "../../../actions/";

const OddFormatSwitcher = React.createClass({
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    },

    /**
     * @name changeOddsFormat
     * @description chenge betslip odds format
     * @returns {undefined}
     * */
    changeOddsFormat () {
        console.log("odds format changed to", this.refs.oddsFormatSelect.value);
        if (this.refs.oddsFormatSelect.value !== this.props.preferences.lang) { //eslint-disable-line react/prop-types
            this.props.dispatch(PreferencesSet("oddsFormat", this.refs.oddsFormatSelect.value)); //eslint-disable-line react/prop-types
        }
    }
});

function mapStateToProps (state) {
    return {
        preferences: state.preferences
    };
}

export default connect(mapStateToProps)(OddFormatSwitcher);