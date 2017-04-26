import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {ChangePassword} from "../../../actions/user";
import Config from "../../../config/main";
import Validate from "../../../helpers/validate";
import formsNames from "../../../constants/formsNames";
import {t} from "../../../helpers/translator";


/**
 * @name validate
 * @description user register password field valitade from config
 * @param values
 * @returns {object}
 * */
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
    Validate(values.oldpassword, "oldpassword", "required", errors);
    return errors;
};

const ProfileChangePassword = React.createClass({

    /**
     * @name submit
     * @description change user password submition
     * @param values
     * @returns {undefined}
     * */
    submit (values) {
        console.log("ProfileChangePassword", values);
        this.props.dispatch(ChangePassword(values.oldpassword, values.password, formsNames.changePasswordForm)); //eslint-disable-line react/prop-types
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function mapStateToProps (state, ownParams) {
    return {
        preferences: state.preferences,
        user: state.user,
        ui: state.uiState,
        forms: state.form,
        ownParams
    };
}
export default connect(mapStateToProps)(reduxForm({form: formsNames.changePasswordForm, validate})(ProfileChangePassword));