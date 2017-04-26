import React from 'react';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import {Field} from 'redux-form';
import Config from "../../../config/main";
import {getErrorMessageByCode} from '../../../constants/errorCodes';

module.exports = function loginFormTemplate () {
    console.debug("login form props", this.props);

    /**
     * @name displayLoginFailReason
     * @description get user login response and return message of result
     * @param {object} reason
     * @returns {undefined}
     * */
    let displayLoginFailReason = (reason) => {
        console.log("login fail reason:", reason);
        if (!reason.data) {
            return reason.msg || t("Unknown error");
        }
        return getErrorMessageByCode(reason.data.status);
    };

    return (!this.props.user.loginInProgress
            ? <form onSubmit={this.props.handleSubmit(this.doLogin)}>
            <div className="popup-contain-table-m login-form-m">
                    <div className="center-view-contain-form">
                        <div className="form-contain-box">

                                <div className="single-form-item">
                                    {/*<label htmlFor="login-name">{t("Login")}</label>*/}
                                    <Field id="login-name" component="input" type="text" name="login-name" placeholder={t("Login or email")}/>

                                </div>
                                <div className="single-form-item">
                                    {/*<label htmlFor="password">{t("Password")}</label>*/}
                                    <Field id="password" component="input" type="password" name="password" placeholder={t("Password")}/>
                                </div>
                                <div className="single-form-item">
                                    <label htmlFor="remember" className="checkbox-wrapper-m">
                                        <Field component="input" id="remember" name="remember" type="checkbox" />
                                        <span>{t("Remember me")}</span>
                                    </label>
                                </div>
                            { this.props.user.loginFailReason
                                ? <div className="login-error"><span>{displayLoginFailReason(this.props.user.loginFailReason)}</span></div>
                                : null
                            }
                            <div className="separator-box-buttons-m">
                                <button className="button-view-normal-m" disabled={this.props.submitting || this.props.pristine || !this.props.valid} type="submit">{t("Login")}</button>
                            </div>
                            { !Config.disableRegisterButtons
                                ? <div className="separator-box-buttons-m">
                                    <button className="button-view-normal-m trans-m" onClick={this.props.openPopup("RegistrationForm")} type="button">{t("JOIN NOW")}</button>
                                  </div>
                                : null
                            }

                            <div className="forgot-password-m">
                                <p onClick={this.props.openPopup("ForgotPassword")}><span>{t("Forgot Password?")}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            : <Loader/>
    );
};
