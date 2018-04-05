import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {SetUserLimits} from "../../../actions/user";
import formsNames from '../../../constants/formsNames';

const profileTimeoutLimitation = React.createClass({
    /**
     * @name submit
     * @description submit user's self exlusion period
     * @param values
     * @returns {undefined}
     */
    submit (values) {
        this.props.dispatch(SetUserLimits("timeout-limits", {period: values.period}, formsNames.timeOutLimitationForm)); //eslint-disable-line react/prop-types
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state) {
    return {
        ui: state.uiState,
        forms: state.form
    };
}

export default connect(mapStateToProps)(reduxForm({form: formsNames.timeOutLimitationForm})(profileTimeoutLimitation));