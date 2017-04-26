import React from 'react';
import {connect} from 'react-redux';
import {UILoadingReset} from "../../../actions/ui";
import {ChangeForgottenPassword} from "../../../actions/user";
import formsNames from "../../../constants/formsNames";
import {reduxForm} from 'redux-form';
import Validate from "../../../helpers/validate";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";

const ResetPasswordForm = React.createClass({

    /**
     * @name resetPassword
     * @description reset user password
     * @param {object} values
     * @returns {undefined}
     * */
    resetPassword (values) {
        console.log("reseting password:", values, this.props.code); //eslint-disable-line react/prop-types
        this.props.dispatch(ChangeForgottenPassword(values.password, this.props.code)); //eslint-disable-line react/prop-types
    },

    /**
     * @name resetResult
     * @description reset state
     * @param {object} values
     * @returns {undefined}
     * */
    resetResult () {
        //eslint-disable-next-line react/prop-types
        this.props.dispatch(UILoadingReset(formsNames.changeForgottenPasswordForm)); // reset state
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

/**
 * @name validate
 * @description check register fields validations from config
 * @param {Object} values
 * @returns {Object}
 */
const validate = values => {
    const errors = {};
    Validate(values.password, "password", ["minlength", Config.main.regConfig.fields.password.customAttrs.minlength], errors, Config.main.regConfig.fields.password.validationMessages.minlength);
    Validate(values.password2, "password2", ["minlength", Config.main.regConfig.fields.password.customAttrs.minlength], errors, Config.main.regConfig.fields.password.validationMessages.minlength);
    Validate(values.password, "password", ["maxlength", Config.main.regConfig.fields.password.customAttrs.maxlength], errors, Config.main.regConfig.fields.password.validationMessages.maxlength);
    Validate(values.password2, "password2", ["maxlength", Config.main.regConfig.fields.password.customAttrs.maxlength], errors, Config.main.regConfig.fields.password.validationMessages.maxlength);
    if (Config.main.regConfig.fields.password.customAttrs.regex) {
        Validate(values.password, "password", ["regex", Config.main.regConfig.fields.password.customAttrs.regex], errors, Config.main.regConfig.fields.password.validationMessages.regex);
        Validate(values.password2, "password2", ["regex", Config.main.regConfig.fields.password.customAttrs.regex], errors, Config.main.regConfig.fields.password.validationMessages.regex);
    }
    Validate(values.password, "password", "required", errors);
    Validate(values.password2, "password2", "required", errors);
    Validate(values.password2, "password2", ["match", values.password], errors, t("Passwords don't match"));
    return errors;
};

export default connect(mapStateToProps)(reduxForm({form: formsNames.changeForgottenPasswordForm, validate})(ResetPasswordForm));