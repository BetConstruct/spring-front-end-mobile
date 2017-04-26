import React from 'react';
import {Field} from 'redux-form';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import formsNames from "../../../constants/formsNames";

module.exports = function profileChangePasswordTemplate () {
    console.debug("change password props", this.props);
    let errors = (!this.props.pristine && this.props.forms && this.props.forms[formsNames.changePasswordForm] && this.props.forms[formsNames.changePasswordForm].syncErrors) || {};

    /**
     * @name displayFailReason
     * @description get changes of user profile check the result and return corresponding message
     * @param {object} response
     * @returns {Object}
     * */
    function displayFailReason (response) {
        console.log("change password failreason", response);
        let reason;
        if ((response.data && response.data.match("1006")) || (response && response.code === 12)) {
            reason = t("Invalid current password.");
        } else {
            reason = t("Password cannot be changed, please try again later or contact support.") + (response && response.msg);
        }
        return <div className="error-text-contain"><p>{reason}</p></div>;
    }

    return <form onSubmit={this.props.handleSubmit(this.submit)}>
        <div className="change-password-container-m">
            <div className={"change-password-form-item-m" + (errors.password ? " error" : "")}>
                <label>{t("New password")}</label>
                <div className="single-form-item">
                    <Field component="input" type="password" name="password" />
                    {errors.password ? <p className="error-message">{errors.password}</p> : null}
                </div>
            </div>
            <div className={"change-password-form-item-m" + (errors.password2 ? " error" : "")}>
                <label>{t("Repeat new password")}</label>
                <div className="single-form-item">
                    <Field component="input" type="password" name="password2" />
                    {errors.password2 ? <p className="error-message">{errors.password2}</p> : null}
                </div>
            </div>
            <div className={"change-password-form-item-m" + (errors.oldpassword ? " error" : "")}>
                <label>{t("Current password")}</label>
                <div className="single-form-item">
                    <Field component="input" type="password" name="oldpassword" />
                    {errors.oldpassword ? <p className="error-message">{errors.oldpassword}</p> : null}
                </div>
            </div>

            {this.props.submitting ? <Loader/> : null}
            <div className="separator-box-buttons-m">
                <button className="button-view-normal-m"
                        disabled={this.props.submitting || this.props.pristine || !this.props.valid}
                        type="submit">
                    {t("Change password")}
                </button>
                { this.props.ui.failReason[formsNames.changePasswordForm] ? displayFailReason(this.props.ui.failReason[formsNames.changePasswordForm]) : null}
                {(this.props.ui.loading[formsNames.changePasswordForm] === false && !this.props.ui.failReason[formsNames.changePasswordForm]) ? <div className="success"><p>{t("Password successfully changed.")}</p></div> : null }
            </div>
        </div>
        </form>;
};
