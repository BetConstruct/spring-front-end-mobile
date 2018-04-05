import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {SwarmDataMixin} from '../../../mixins/swarmDataMixin';
import {reduxForm} from 'redux-form';
import {SetUserLimits} from "../../../actions/user";
import formsNames from '../../../constants/formsNames';

class ProfileRealityChecks extends Component {
    /**
     * @name submit
     * @description submit user's self exlusion period
     * @params values
     * @returns {undefined}
     * */
    submit (values) {
        console.log("submit", values);
        this.props && this.props.dispatch(SetUserLimits("reality-checks", values.limit, formsNames.realityChecksForm)); //eslint-disable-line react/prop-types
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

function mapStateToProps (state) {
    return {
        ui: state.uiState,
        forms: state.form
    };
}

export default connect(mapStateToProps)(reduxForm({form: formsNames.realityChecksForm})(ProfileRealityChecks));