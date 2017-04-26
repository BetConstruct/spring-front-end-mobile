import React from 'react';
import {Register, LoadCaptcha} from "../actions/login";
import formsNames from '../constants/formsNames';
import {t} from "../helpers/translator";
import {Field, SubmissionError} from 'redux-form';
import moment from 'moment';
import Config from "../config/main";
import {getErrorMessageByCode} from '../constants/errorCodes';
import {RenderInputField, RenderSelectField, RenderCaptchaField, RenderAgreeField, RenderCountryCodeField,
    RenderAvailableCurrenciesField, RenderPhoneNumberField, RenderDatePickerField
} from "../components/registrationFields/";
import {UpdateHashParams} from "../actions/hashParams";

let registrationConfigs = Config.main.regConfig;

/**
 * @name toBackendObject
 * @description Helper method to prepare request data
 * @param {object} values
 * @returns {object}
 */
function toBackendObject (values) {
    let requestData = Object.assign({}, values);

    requestData.phone && (function () {
        let temp = Object.assign({}, requestData.phone);
        delete requestData.phone;
        requestData.phone = temp.fullNumber;
        requestData.phone_code = temp.code;
    }());

    if (registrationConfigs.settings.sendEmailAsUsername) {
        requestData.ignore_username = "1";
        delete requestData.username;
    }

    if (requestData.captcha) {
        requestData.captcha_text = requestData.captcha;
        delete requestData.captcha;
    }

    if (requestData.birth_date) {
        requestData.birth_date = moment(requestData.birth_date).format(registrationConfigs.settings.dateFormat || "YYYY-MM-DD");
    }

    return requestData;
}

/**
 * @name handleSubmissionErrors
 * @description Helper method to process error and get user friendly message
 * @param {object} response
 * @throws SubmissionError
 */
function handleSubmissionErrors (response) {
    let code = response.result || response.code;
    switch (Math.abs(+code)) {
        case 21:
            throw new SubmissionError({captcha: getErrorMessageByCode(code)});
        case 1010:
        case 1013:
            throw new SubmissionError({password: getErrorMessageByCode(code)});
        case 1012:
        case 1014:
        case 1127:
        case 1134:
            throw new SubmissionError({phone: getErrorMessageByCode(code)});
        case 1118:
            throw new SubmissionError({username: getErrorMessageByCode(code)});
        case 1119:
            throw new SubmissionError({email: getErrorMessageByCode(code)});
        case 1122:
            throw new SubmissionError({personal_id_6: getErrorMessageByCode(code)});
        case 1123:
            throw new SubmissionError({doc_number: getErrorMessageByCode(code)});
        case 1135:
            throw new SubmissionError({bank_details: getErrorMessageByCode(code)});
        case 3001:
            throw new SubmissionError({currency_name: getErrorMessageByCode(code)});
        default :
            throw new SubmissionError({_error: getErrorMessageByCode(9999999)});
    }
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
export var RegistrationMixin = ComposedComponent => class RegistrationMixin extends React.Component {

    submit (values) {
        let self = this;
        return Register(toBackendObject(values), formsNames.registrationForm)(self.props.dispatch).then(function (response) { //eslint-disable-line react/prop-types
            (response.result !== "OK") ? handleSubmissionErrors(response) : handleSubmissionSuccess(self.props.dispatch);
        });
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
        this.props.dispatch(LoadCaptcha()); //eslint-disable-line react/prop-types
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
        return () => {
            let fields = [];
            for (var prop in _self.props.fieldsFromConfig) {
                fields.push(_self.props.fieldsFromConfig[prop]);
            }
            return fields;
        };
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
                case "email" :
                case "password" :
                case "number" :
                case "checkbox" :
                case "text" :
                    return (
                        <Field component={RenderInputField}
                               type={configItem.type}
                               name={configItem.name}
                               key={configItem.name}
                               className={configItem.classes + " reg_" + configItem.name}
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
                case "country_code" :
                    return (
                        <Field component={RenderCountryCodeField}
                               name={configItem.name}
                               key={configItem.name}
                               labelMessage={t(configItem.labelText)}
                               className={configItem.classes + " reg_" + configItem.name}
                               changeHandler={_self.props.handleCountryCodeChange.bind(_self)}
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
                        <Field name={configItem.name}
                               key={configItem.name}
                               labelMessage={t(configItem.labelText)}
                               className={configItem.classes + " reg_" + configItem.name}
                               defaultCountry={registrationConfigs.settings.defaultCountry ? registrationConfigs.settings.defaultCountry.toLowerCase() : ''}
                               component={RenderPhoneNumberField}/>
                    );
                case "datePicker" :
                    return (
                        <Field name={configItem.name}
                               key={configItem.name}
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
        return <ComposedComponent.Component {...this.props} {...this.state}
            submit={this.submit}
            getValidationErrors={this.getValidationErrors}
            fieldsArray={this.fieldsArray}
            getSingleComponent={this.getSingleComponent}
            resetCaptcha={this.resetCaptcha}
            handleCountryCodeChange={this.handleCountryCodeChange}
        />;
    }
};

