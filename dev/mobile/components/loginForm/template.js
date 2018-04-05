import React from 'react';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import {Field} from 'redux-form';
import Config from "../../../config/main";
import {getErrorMessageByCode} from '../../../constants/errorCodes';
import {
    checkPartnerExternalLinks, getExternalLink
} from "../../../helpers/checkPartnerIntegrationExternalLinks";
import PropTypes from "prop-types";

const RenderInputField = ({input, id = '', placeholder, className, key, type, meta: {touched, error}}) => {
    return (
        <div className={className} key={key}>
            <input {...input} placeholder={placeholder} type={type} id={id} />
            {touched && error ? <p className="error-message">{t(error)}</p> : null}
        </div>
    );
};

RenderInputField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    className: PropTypes.string,
    key: PropTypes.string,
    type: PropTypes.string
};

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
            return reason.msg ? t(reason.msg) : t("Unknown error");
        }
        return getErrorMessageByCode(reason.data.status);
    };

    return (!this.props.user.loginInProgress
            ? <form onSubmit={this.props.handleSubmit(this.doLogin)}>
            <div className="popup-contain-table-m login-form-m">
                    <div className="center-view-contain-form">
                        <div className="form-contain-box">

                                <Field id="login-name" component={RenderInputField} className="single-form-item" type="text" name="login-name" placeholder={t("Login or email")}/>

                                <Field id="password" component={RenderInputField} className="single-form-item" type="password" name="password" placeholder={t("Password")}/>
                                {
                                    !Config.main.disableRememberMeSection
                                        ? <div className="single-form-item">
                                            <label htmlFor="remember" className="checkbox-wrapper-m">
                                                <Field component="input" id="remember" name="remember" type="checkbox" />
                                                <span>{t("Remember me")}</span>
                                            </label>
                                        </div>
                                        : null
                                }
                            { this.props.user.loginFailReason
                                ? <div className="login-error"><span>{t(displayLoginFailReason(this.props.user.loginFailReason))}</span></div>
                                : null
                            }
                            <div className="separator-box-buttons-m">
                                <button className="button-view-normal-m" disabled={this.props.submitting || this.props.pristine || !this.props.valid} type="submit">{t("Login")}</button>
                            </div>
                            {
                                !Config.main.disableRegisterButtons
                                    ? <div className="separator-box-buttons-m">
                                    {
                                        checkPartnerExternalLinks("registration")
                                            ? <a href={getExternalLink("registration")}>{t("JOIN NOW")}</a>
                                            : <button className="button-view-normal-m trans-m" onClick={this.props.openPopup("RegistrationForm")} type="button">{t("JOIN NOW")}</button>
                                    }
                                    </div>
                                    : null
                            }
                            <div className="forgot-password-m">
                                {
                                    checkPartnerExternalLinks("forgotPassword")
                                        ? <a href={getExternalLink("forgotPassword")}>{t("Forgot Password?")}</a>
                                        : <p onClick={this.props.openPopup("ForgotPassword")}><span>{t("Forgot Password?")}</span></p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            : <Loader/>
    );
};
