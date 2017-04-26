import React from 'react';
import {Field} from 'redux-form';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import formsNames from "../../../constants/formsNames";

module.exports = function resetPassTemplate () {
    console.log("forgot password template", this.props);

    /**
     * @name displayFailReason
     * @description get reset password response , check the result and return corresponding message
     * @param {object} result
     * @returns {undefined}
     * */
    function displayFailReason (result) {
        switch (result) {
            case "-1002":
            case -1002: return t("Entered email address doesn't exist.");
            case "-1028":
            case -1028: return t("Password reset failed. The link is expired for security reasons.");
            default: return t("Cannot reset password. Please contact support.");
        }
    }
    if (this.props.ui.loading[formsNames.resetPasswordForm] === undefined || this.props.ui.failReason[formsNames.resetPasswordForm]) {
        let errors = (!this.props.pristine && this.props.forms && this.props.forms[formsNames.resetPasswordForm] && this.props.forms[formsNames.resetPasswordForm].syncErrors) || {};
        return <div className="popup-contain-table-m login-form-m">
            <div className="center-view-contain-form">
                <div className="form-contain-box">
                    <form onSubmit={this.props.handleSubmit(this.resetPassword)}>
                        <div className="single-form-item">
                            <Field component="input" id="email" name="email" type="email" placeholder={t("Enter your email address")}/>
                            {errors.email ? <p className="error-message">{errors.email}</p> : null}
                        </div>

                    { this.props.ui.failReason[formsNames.resetPasswordForm]
                        ? <div className="login-error"><span>{displayFailReason(this.props.ui.failReason[formsNames.resetPasswordForm].result)}</span></div>
                        : null
                    }
                    <div className="separator-box-buttons-m">
                        <button className="button-view-normal-m" type="submit" disabled={this.props.submitting || this.props.pristine || !this.props.valid}>{t("Reset")}</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>;
    } else if (this.props.ui.loading[formsNames.resetPasswordForm] === true) {
        return <Loader/>;
    } else {
        return <div className="text-popup-view-m"><p>{t("Please check your email.")}</p></div>;
    }
};
