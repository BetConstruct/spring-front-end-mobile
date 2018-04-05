import React from 'react';
import Loader from "../../components/loader/";
import {t} from "../../../helpers/translator";
import Config from "../../../config/main";
import {checkPartnerExternalLinks, getExternalLink} from "../../../helpers/checkPartnerIntegrationExternalLinks";
import Swipeable from 'react-swipeable';

let regConfig = Config.main.regConfig;
module.exports = function registrationFormTemplate() {
    let errors = this.props.getValidationErrors.call(this),
        fieldsArray = this.props.fieldsArray.call(this),
        getSingleComponent = this.props.getSingleComponent.call(this),
        {props: {submitHandler, handleSubmit}} = this; //eslint-disable-line react/prop-types

    let formContent = [
        regConfig && regConfig.settings &&
        !this.props.activeStep && regConfig.settings.enableMultiStepForm &&
        regConfig.settings.multiStepRegistrationWelcomeMessages &&
        regConfig.settings.multiStepRegistrationWelcomeMessages.map((message) => <p className={'' + (message.className || '')}>{t(message.text || '')}</p>) || null,
        fieldsArray.map((field, index) => (
            getSingleComponent(field, index, errors, this.props.cmsData)
        )),
        <div className="separator-box-buttons-m">
            {
                regConfig.hasOwnProperty("steps") && (this.props.activeStep !== 0) && (
                    <button className="button-view-normal-m"
                            type="button"
                            onClick={() => {
                                this.props.goBack();
                            }}>
                        {t("Back")}
                    </button>
                )
            }
            <button className="button-view-normal-m"
                    type="button"
                    onClick={handleSubmit(submitHandler)}>
                {typeof this.props.activeStep === "number" &&
                regConfig.hasOwnProperty("steps") &&
                (this.props.activeStep !== regConfig.steps.length - 1)
                    ? t("Next")
                    : t("Register")}
            </button>
        </div>
    ];
    return (!this.props.user.loginInProgress
            ? <div className={
                regConfig &&
                regConfig.settings &&
                regConfig.settings.enableMultiStepForm
                    ? `popup-contain-table-m login-form-m registration-form-b multistep-form ${!this.props.activeStep ? 'first' : ''}`
                    : "popup-contain-table-m login-form-m registration-form-b"
            }>
                <div className="center-view-contain-form">
                    <div className="form-contain-box">
                        <form>
                            {
                                regConfig && regConfig.settings && regConfig.settings.enableMultiStepForm
                                    ? (
                                    <Swipeable className="right-navigate-list-view-m" onSwipingRight={this.props.goBack}
                                               onSwipingLeft={handleSubmit(submitHandler)}>
                                        {
                                            formContent
                                        }
                                    </Swipeable>
                                )
                                    : (formContent)
                            }
                        </form>
                        <div className="steps-for-reg-m">
                            {
                                regConfig.hasOwnProperty("steps") && !this.props.activeStep && regConfig.settings && regConfig.settings.addLoginPartToForm && (
                                    <div className="separator-box-buttons-m">
                                        {!Config.main.disableRegisterButtons ?
                                            <label>{t("Already existing account?")}</label> : null}
                                        {
                                            checkPartnerExternalLinks("login")
                                                ? <a href={getExternalLink("login")}>{t("SIGN IN")}</a>
                                                : <button className="button-view-normal-m trans-m-s-i"
                                                          onClick={this.handleLoginClick}>{t("SIGN IN")}</button>
                                        }
                                    </div>
                                )
                            }
                            {
                                regConfig.hasOwnProperty("steps") &&
                                regConfig.steps.map(
                                    (step, index) => <i
                                        className={`registration-steps-slide-view ${index === (this.props.activeStep || 0) ? 'active' : ''}`}/>
                                )
                            }

                        </div>
                        { this.props.error
                            ? <div className="login-error"><span>{this.props.error}</span></div>
                            : null
                        }
                    </div>
                </div>
            </div>

            : <Loader/>
    );
};