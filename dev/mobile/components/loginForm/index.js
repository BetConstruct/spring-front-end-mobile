import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Validate from "../../../helpers/validate";
import formsNames from '../../../constants/formsNames';
import {Login} from "../../../actions/login";
import {UIMixin} from '../../../mixins/uiMixin';
import Config from '../../../config/main';
import Helpers from '../../../helpers/helperFunctions';

const LoginForm = React.createClass({

    /**
     * @name doLogin
     * @description login user
     * @param values
     * @returns {undefined}
     * */
    doLogin (values) {
        console.log("logging in with", values);
        this.props.dispatch(Login(values['login-name'], values.password, !!values.remember));
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }

});

function mapStateToProps (state, ownParams) {
    return {
        user: state.user,
        initialValues: {remember: true},
        uiState: state.uiState,
        ownParams: ownParams
    };
}

const validate = values => {
    const errors = {};
    Validate(values["login-name"], "login-name", "required", errors);
    if (Helpers.CheckIfPathExists(Config, "main.loginConfig.fields.loginName.customAttrs.regex")) {
        Validate(values["login-name"], "login-name", ["regex", Config.main.loginConfig.fields.loginName.customAttrs.regex], errors, Config.main.loginConfig.fields.loginName.validationMessages && Config.main.loginConfig.fields.loginName.validationMessages.regex);
    }
    Validate(values.password, "password", "required", errors);
    return errors;
};

export default connect(mapStateToProps)(UIMixin({Component: reduxForm({form: formsNames.loginForm, validate})(LoginForm)}));