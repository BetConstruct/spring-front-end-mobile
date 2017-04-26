import React from 'react';
import {Field} from 'redux-form';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import formsNames from "../../../constants/formsNames";

module.exports = function resetPassTemplate () {
    console.log("reset password template", this.props);

    /**
     * @name displayFailReason
     * @description get reset password response , check the result and return corresponding message
     * @param {object} result
     * @returns {undefined}
     * */
    function displayFailReason (result) {
        switch (result) {
            case "-1028":
            case -1028: return t("Password reset failed. The link is expired for security reasons.");
            default: return t("Cannot reset password. Please contact support.");
        }
    }
    if (this.props.ui.loading[formsNames.changeForgottenPasswordForm] === undefined || this.props.ui.failReason[formsNames.changeForgottenPasswordForm]) {
        let errors = (!this.props.pristine && this.props.forms && this.props.forms[formsNames.changeForgottenPasswordForm] && this.props.forms[formsNames.changeForgottenPasswordForm].syncErrors) || {};
        return <div className="popup-contain-table-m login-form-m">
            <div className="center-view-contain-form">
                <div className="form-contain-box">
                    <form onSubmit={this.props.handleSubmit(this.resetPassword)}>
                        <div className="single-form-item">
                            <Field component="input" id="password" name="password" type="password" placeholder={t("New password")}/>
                            {errors.password ? <p className="error-message">{errors.password}</p> : null}
                        </div>
                        <div className="single-form-item">
                            <Field component="input" id="password2" name="password2" type="password" placeholder={t("Repeat new password")}/>
                            {errors.password2 ? <p className="error-message">{errors.password2}</p> : null}
                        </div>

                    { this.props.ui.failReason[formsNames.changeForgottenPasswordForm]
                        ? <div className="login-error"><span>{displayFailReason(this.props.ui.failReason[formsNames.changeForgottenPasswordForm].result)}</span></div>
                        : null
                    }
                    <div className="separator-box-buttons-m">
                        <button className="button-view-normal-m" type="submit" disabled={this.props.submitting || this.props.pristine || !this.props.valid}>{t("Change password")}</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>;
    } else if (this.props.ui.loading[formsNames.changeForgottenPasswordForm] === true) {
        return <Loader/>;
    } else {
        return <div className="text-popup-view-m"><p>{t("Password successfully changed.")}</p></div>;
    }
};
