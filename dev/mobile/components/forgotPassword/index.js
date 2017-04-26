import React from 'react';
import {connect} from 'react-redux';
import {UILoadingReset} from "../../../actions/ui";
import {ResetPassword} from "../../../actions/user";
import formsNames from "../../../constants/formsNames";
import {reduxForm} from 'redux-form';
import Validate from "../../../helpers/validate";

const ForgotPassword = React.createClass({

    /**
     * @name resetPassword
     * @description reset user password
     * @param {object} values
     * @returns {undefined}
     * */
    resetPassword (values) {
        console.log("reset password", values);
        this.props.dispatch(ResetPassword(values.email)); //eslint-disable-line react/prop-types
    },

    /**
     * @name resetResult
     * @description reset state
     * @returns {undefined}
     * */
    resetResult () {
        //eslint-disable-next-line react/prop-types
        this.props.dispatch(UILoadingReset(formsNames.resetPasswordForm)); // reset state
    },
    componentWillMount () {
        this.resetResult();
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }

});

function mapStateToProps (state, ownParams) {
    return {
        user: state.user,
        ui: state.uiState,
        ownParams: ownParams,
        forms: state.form
    };
}

const validate = values => {
    const errors = {};
    Validate(values.email, "email", "required", errors);
    Validate(values.email, "email", "email", errors);
    return errors;
};

export default connect(mapStateToProps)(reduxForm({form: formsNames.resetPasswordForm, validate})(ForgotPassword));