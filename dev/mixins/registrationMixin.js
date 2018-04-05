import React from 'react';
import {Register, LoadCaptcha, LoadReCaptcha} from "../actions/login";
import formsNames from '../constants/formsNames';
import {t} from "../helpers/translator";
import {Field, SubmissionError, stopSubmit} from 'redux-form';
import moment from 'moment';
import Config from "../config/main";
import {getErrorMessageByCode} from '../constants/errorCodes';
import {RenderInputField, RenderSelectField, RenderCaptchaField, RenderAgreeField, RenderCountryCodeField,
    RenderAvailableCurrenciesField, RenderDatePickerField, Recaptcha, RenderPasswordField
} from "../components/registrationFields/";
import {UpdateHashParams} from "../actions/hashParams";
import Helpers from "../helpers/helperFunctions";
import {connect} from "react-redux";
import {SetRegistrationState} from "../actions/user";
import PropTypes from "prop-types";
import {UIClose, UILoadingDone} from "../actions/ui";

let registrationConfigs = Config.main.regConfig;

const amountNormalizer = (value) => {
    if (value && ("" + value).length > 1 && ("" + value).match(/^0/) && ("" + value).indexOf(".") !== 1) {
        value = value.split("");
        value = value[1];
    }
    return value;
};

/**
 * @name toBackendObject
 * @description Helper method to prepare request data
 * @param {object} values
 * @returns {object}
 */
function toBackendObject (values) {
    let requestData = Object.assign({}, values);

    for (let prop in requestData) {
        requestData[prop] = typeof requestData[prop] === "string" ? requestData[prop].trim() : requestData[prop];
    }
    if (requestData.phone) {
        let temp = Object.assign({}, {fullNumber: requestData.phone, code: requestData.phone_code});
        delete requestData.phone;
        delete requestData.phone_code;
        let code = temp.code.replace(/\+/g, '');
        requestData.phone = `${code}${temp.fullNumber}`;
        requestData.phone_code = temp.code.replace(code, '');
    } else {
        delete requestData.phone;
        delete requestData.phone_code;
    }

    if (registrationConfigs.settings.sendEmailAsUsername) {
        requestData.ignore_username = "1";
        delete requestData.username;
    }

    if (registrationConfigs.settings.sendPhoneAsUsername) {
        requestData.username = requestData.phone;
    }

    if (requestData.captcha) {
        requestData.captcha_text = requestData.captcha;
        delete requestData.captcha;
    }
    if (requestData.birth_date) {
        requestData.birth_date = moment(requestData.birth_date).locale("en").format(registrationConfigs.settings.dateFormat || "YYYY-MM-DD");
    }
    return requestData;
}

/**
 * @name handleSubmissionErrors
 * @description Helper method to process error and get user friendly message
 * @param {object} response
 * @param {Array} fields
 * @throws SubmissionError
 */
function handleSubmissionErrors (response, fields) {
    let code = response.result || response.code,
        error = {},
        errorKey;

    fields = (fields) || (registrationConfigs && registrationConfigs.fields && Object.keys(registrationConfigs.fields).map((field) => registrationConfigs.fields[field].name));

    switch (Math.abs(+code)) {
        case 21:
            error = {captcha: getErrorMessageByCode(code)};
            break;
        case 1010:
        case 1013:
            error = {password: getErrorMessageByCode(code)};
            break;
        case 1012:
        case 1014:
        case 1127:
        case 1134:
            error = {phone: getErrorMessageByCode(code)};
            break;
        case 1118:
            error = {username: getErrorMessageByCode(code)};
            break;
        case 1119:
            error = {email: getErrorMessageByCode(code)};
            break;
        case 1122:
            error = {personal_id_6: getErrorMessageByCode(code)};
            break;
        case 1123:
            error = {doc_number: getErrorMessageByCode(code)};
            break;
        case 1135:
            error = {bank_details: getErrorMessageByCode(code)};
            break;
        case 2098:
        case 3001:
            error = {currency_name: getErrorMessageByCode(code)};
            break;
        default :
            throw new SubmissionError({_error: getErrorMessageByCode(9999999)});
    }

    errorKey = Object.keys(error)[0];
    if (fields && fields.indexOf(errorKey) === -1) {
        error["_error"] = error[errorKey];
        delete error[errorKey];
    }
    throw new SubmissionError(error);
}

/**
 * @name handleSubmissionSuccess
 * @description Reset externally given promo code after registration.
 * External params coming from url as a hash param
 * @param {function} dispatch
 * @fire event:updateHashParams
 */
function handleSubmissionSuccess (dispatch) {
    dispatch(UpdateHashParams({btag: null}));
}

/**
 * @name RegistrationMixin
 * @description RegistrationMixin is a HOC(Higher Order Component) which adds additional properties and methods to wrapped component
 * @param {React.Component} ComposedComponent
 * @constructor
 */
export var RegistrationMixin = (ComposedComponent) => {

    class RegistrationMixin extends React.Component {
        setStep (payload, meta) {
            this.props.dispatch(SetRegistrationState(payload, meta));
        }

        componentWillUnmount () {
            this.setStep(0, {});
        }

        submit (values) {
            if (registrationConfigs && registrationConfigs.settings && registrationConfigs.settings.enableMultiStepForm) {
                this.clientBufferedData = this.clientBufferedData || {};
                let inputValues = (() => {
                    let fetched = {};
                    registrationConfigs.steps[this.props.currentStep].fields.forEach(  //eslint-disable-line react/prop-types
                        field => (fetched[registrationConfigs.fields[field].name] = values[registrationConfigs.fields[field].name])
                    );
                    return fetched;
                })();
                this.clientBufferedData = {
                    ...this.clientBufferedData,
                    ...inputValues
                };
                if (this.props.currentStep < registrationConfigs.steps.length - 1) { //eslint-disable-line react/prop-types
                    return this.setStep(this.props.currentStep + 1, this.clientBufferedData); //eslint-disable-line react/prop-types
                }
            }
            if (!this.props.connected && this.props.useWebSocket) {
                return new Promise((resolve) => {
                    resolve();
                }).then(
                    () => {
                        this.props.dispatch(stopSubmit(formsNames.registrationForm, {error: {}}));
                        this.props.dispatch(UILoadingDone(formsNames.registrationForm));
                        throw new SubmissionError({_error: getErrorMessageByCode("WEBSOCKET_DISCONNECTED")});
                    }
                );
            }
            if (this.clientBufferedData && this.clientBufferedData.promo_code !== values.promo_code) {
                this.clientBufferedData.promo_code = this.clientBufferedData.promo_code || values.promo_code;
            }
            return Register(toBackendObject(this.clientBufferedData || values), formsNames.registrationForm, this.props.geoData)(this.props.dispatch).then(
                (response) => { //eslint-disable-line react/prop-types
                    this.props.dispatch(UIClose("rightMenu"));
                    registrationConfigs.settings && registrationConfigs.settings.sendEmailAsUsername && response.result === "-1118" && (response.result = "1119");
                    if (response.result !== "OK") {
                        handleSubmissionErrors(response, this.clientBufferedData && registrationConfigs.steps && registrationConfigs.steps[this.props.currentStep].fields);
                    } else {
                        registrationConfigs.settings && registrationConfigs.settings.redirectAfterRegistration && this.context.router.push("/balance/deposit");
                        //handleSubmissionSuccess(this.props.dispatch);
                    }
                },
                (response) => {
                    handleSubmissionErrors(response, this.clientBufferedData && registrationConfigs.steps && registrationConfigs.steps[this.props.currentStep].fields);
                }
            );
        }

        /**
         * @name handleCountryCodeChange
         * @description Additional event handler for country code maybe partner wants to change some fields dependant on it
         * @param {event} evt
         * @returns {undefined}
         */
        handleCountryCodeChange (evt) {
            ComposedComponent.handleCountryCodeChange.call(this, evt);
        }

        /**
         * @name resetCaptcha
         * @description Helper function to load new captcha
         * @fire event:loadCaptcha
         */
        resetCaptcha () {
            registrationConfigs.fields.captcha ? this.props.dispatch(LoadCaptcha()) : registrationConfigs.fields.re_captcha && this.props.dispatch(LoadReCaptcha());
        }

        /**
         * @name fetchDataFromServer
         * @description Start loading necessary data
         */
        fetchDataFromServer () {
            this.resetCaptcha();
        }

        /**
         * @name getValidationErrors
         * @description Helper function to show user friendly validation messages
         * @returns {string}
         */
        getValidationErrors () {
            return (this.props.anyTouched && this.props.forms && this.props.forms.registrationForm && this.props.forms.registrationForm.syncErrors) || {}; //eslint-disable-line react/prop-types
        }

        /**
         * @name fieldsArray
         * @description Helper function to get registration fields array
         * @returns {Array}
         */
        fieldsArray () {
            let _self = this;
            return (() => {
                let fields = [],
                    currentStepFields,
                    isMultiStepEnabled = registrationConfigs && registrationConfigs.settings && registrationConfigs.settings.enableMultiStepForm;

                if (isMultiStepEnabled) {
                    let {props: {activeStep}} = this; //eslint-disable-line react/prop-types
                    currentStepFields = registrationConfigs.steps[activeStep] && registrationConfigs.steps[activeStep].fields;
                }
                for (let prop in _self.props.fieldsFromConfig) {
                    if (_self.props.fieldsFromConfig.hasOwnProperty(prop)) {
                        if (Array.isArray(currentStepFields)) {
                            currentStepFields.includes(prop) && fields.push(_self.props.fieldsFromConfig[prop]);
                        } else {
                            fields.push(_self.props.fieldsFromConfig[prop]);
                        }
                    }
                }
                return fields.sort(Helpers.byOrderSortingFunc);
            })();
        }

        goBack () {
            (this.props.currentStep - 1 >= 0) && this.props.dispatch(SetRegistrationState(this.props.currentStep - 1));
        }

        /**
         * @name getSingleComponent
         * @description Helper function to dynamically get corresponding field for registration form
         * @returns {function}
         */
        getSingleComponent () {
            let _self = this;
            return (configItem, index, errors, cmsData) => {
                switch (configItem.type) {
                    case "number":
                        return (
                            <Field component={RenderInputField}
                                   type={configItem.type}
                                   name={configItem.name}
                                   key={configItem.name}
                                   labelMessage={t(configItem.labelText)}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   normalize={amountNormalizer}
                                   placeholder={t(configItem.title)}/>
                        );
                    case "password" :
                        return (
                            <Field component={RenderPasswordField}
                                   type={configItem.type}
                                   name={configItem.name}
                                   key={configItem.name}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   placeholder={t(configItem.title)}/>
                        );
                    case "email" :
                    case "checkbox" :
                    case "text" :
                        return (
                            <Field component={RenderInputField}
                                   type={configItem.type}
                                   name={configItem.name}
                                   key={configItem.name}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   hashParams={_self.props.hashParams}
                                   placeholder={t(configItem.title)}/>
                        );
                    case "select" :
                        return (
                            <Field component={RenderSelectField}
                                   name={configItem.name}
                                   labelMessage={t(configItem.labelText)}
                                   key={configItem.name}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   options={configItem.options || []}
                                   selected={configItem.type === "select" ? (configItem.options[0].value || configItem.options[0].translationKey || '') : ''}
                                   placeholder={t(configItem.title)} />
                        );
                    case "agree" :
                        return (
                            <Field component={RenderAgreeField}
                                   name={configItem.name}
                                   key={configItem.name}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   placeholder={t(configItem.title)}
                                   cmsData={cmsData}
                                   language={_self.props.preferences.lang}
                            />
                        );
                    case "captcha" :
                        return (
                            <Field component={RenderCaptchaField}
                                   name={configItem.name}
                                   key={configItem.name}
                                   captchaLoaded={_self.props.user.captcha.loaded}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   placeholder={t(configItem.title)}
                                   imageSrc={configItem.type === "captcha" ? _self.props.user.captcha.data.url : ''}
                                   resetCaptchaHandler={configItem.type === "captcha" ? _self.props.resetCaptcha.bind(_self) : function () {}}/>
                        );
                    case "re_captcha" :
                        return (
                            <Field component={Recaptcha}
                                   name={configItem.name}
                                   key={configItem.name}
                                   siteKey={configItem.type === "re_captcha" ? _self.props.user.captcha.data : ''}
                                   captchaLoaded={_self.props.user.captcha.loaded}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   placeholder={t(configItem.title)}
                                   resetCaptchaHandler={configItem.type === "captcha" ? _self.props.resetCaptcha.bind(_self) : function () {}}/>
                        );

                    case "hiddenInput" :
                        return (
                            <Field component={RenderInputField}
                                   type='hidden'
                                   name={configItem.name}
                                   key={configItem.name}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   placeholder={t(configItem.title)}/>
                        );
                    case "country_code" :
                        return (
                            <Field component={RenderCountryCodeField}
                                   name={configItem.name}
                                   key={configItem.name}
                                   labelMessage={t(configItem.labelText)}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   changeHandler={_self.props.handleCountryCodeChange.bind(_self)}
                                   registrationForm={_self.props.registrationForm}
                                   placeholder={t(configItem.title)} />
                        );
                    case "currency_name" :
                        return (
                            <Field component={RenderAvailableCurrenciesField}
                                   name={configItem.name}
                                   key={configItem.name}
                                   labelMessage={t(configItem.labelText)}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   placeholder={t(configItem.title)} />
                        );

                    case "phone" :
                        return (
                            <div className={`form-p-i-m ${configItem.name}_wrapper`}>
                                <Field component={RenderInputField}
                                       type="tel"
                                       name="phone_code"
                                       key={"phone_code"}
                                       className={configItem.classes + " reg_" + configItem.name + "_code"}
                                       placeholder={t("Country code")}/>
                                <Field component={RenderInputField}
                                       type="tel"
                                       name={configItem.name}
                                       key={configItem.name}
                                       className={configItem.classes + " reg_" + configItem.name}
                                       placeholder={t(configItem.title)}/>
                            </div>
                        );
                    case "datePicker" :
                        return (
                            <Field name={configItem.name}
                                   key={configItem.name}
                                   placeholder={t(configItem.placeholder)}
                                   labelMessage={t(configItem.labelText)}
                                   min={registrationConfigs.settings.minYearOld}
                                   max={registrationConfigs.settings.maxYearOld}
                                   className={configItem.classes + " reg_" + configItem.name}
                                   component={RenderDatePickerField}/>
                        );
                    default:
                        return null;
                }
            };
        }

        componentDidMount () {
            this.fetchDataFromServer();
        }

        render () {
            return <ComposedComponent.Component
                                                key={`registrationForm-${this.props.currentStep}`}
                                                {...this.props}
                                                {...this.state}
                                                submitHandler={this.submit.bind(this)}
                                                goBack={this.goBack.bind(this)}
                                                activeStep={this.props.currentStep}
                                                getValidationErrors={this.getValidationErrors}
                                                fieldsArray={this.fieldsArray}
                                                getSingleComponent={this.getSingleComponent}
                                                resetCaptcha={this.resetCaptcha}
                                                handleCountryCodeChange={this.handleCountryCodeChange}
            />;
        }
    }

    RegistrationMixin.propTypes = {
        currentStep: PropTypes.number
    };

    RegistrationMixin.contextTypes = {
        router: PropTypes.object.isRequired
    };

    return connect(state => ({
        currentStep: state.registration.registrationState,
        hashParams: state.persistentUIState.hashParams,
        registrationForm: state.form.registrationForm,
        geoData: state.preferences.geoData,
        connected: state.swarmData.connected,
        useWebSocket: state.swarmData.useWebSocket
    }))(RegistrationMixin);
};

