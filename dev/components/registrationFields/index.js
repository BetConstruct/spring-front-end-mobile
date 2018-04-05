import React from 'react';
import {t} from "../../helpers/translator";
import AvailableCurrencies from "../../components/availableCurrencies/";
import TelephoneInput from '../../mobile/components/telephoneInput';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import HorizontalLoader from "../../components/horizontalLoader/";
import {getPageBySLug} from "../../helpers/cms";
import {TERMS_AND_CONDITIONS_SLUG} from "../../constants/cms";
import Expandable from "../../mobile/containers/expandable";
import countries from "../../constants/countries";
import Config from "../../config/main";
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import PasswordMask from 'react-password-mask';
import Helpers from "../../helpers/helperFunctions";

export const RenderInputField = ({input, placeholder, className, key, showErrorsAnyTime, type, hashParams, labelMessage, meta: {touched, error, pristine}}) => {
    let regConfig = Config.main.regConfig;
    switch (true) {
        case type === "radio" :
            return (
                <div className={className} key={key}>
                    <label>
                        <input {...input} type="radio"/>
                        <span>{placeholder}</span>
                    </label>
                    {touched && error && <p className="error-message">{error}</p>}
                </div>
            );
        default :
            return (
                <div className={className} key={key}>
                    {labelMessage
                        ? (<label className="description-label-w-m">{labelMessage}</label>)
                        : (null)
                    }
                    {
                        input.name === "promo_code" && regConfig && regConfig.settings && regConfig.settings.disablePromoCodeIfBtagExists && hashParams && hashParams.btag
                            ? <span>{hashParams.btag}</span>
                            : <input {...input} placeholder={placeholder} type={type}/>
                    }
                    {showErrorsAnyTime
                        ? error ? <p className="error-message">{t(error)}</p> : null
                        : touched && error ? <p className="error-message">{t(error)}</p> : null
                    }
                </div>
            );
    }
};

export class RenderPasswordField extends React.Component {
    constructor (params) {
        super(params);
        this.onMaskShowHandler = this.onMaskShowHandler.bind(this);
        this.onMaskHideHandler = this.onMaskHideHandler.bind(this);
    }
    onMaskShowHandler () {
        return () => {
            this.showPassword = true;
            this.forceUpdate();
        };
    }
    onMaskHideHandler () {
        return () => {
            this.showPassword = false;
            this.forceUpdate();
        };
    }
    render () {
        let {input, placeholder, className, key, showErrorsAnyTime, type, meta: {touched, error, pristine}} = this.props;
        className += (this.showPassword ? ' showed' : '');
        return (
            <div className={className} key={key}>
                {
                    Config.main.regConfig.fields.password && Config.main.regConfig.fields.password.showPasswordMask === true
                        ? <PasswordMask
                        value={input.value}
                        onShow={this.onMaskShowHandler()}
                        onHide={this.onMaskHideHandler()}
                        onChange={input.onChange}
                        placeholder={placeholder}
                    />
                        : <input {...input} placeholder={placeholder} type={type}/>
                }
                {showErrorsAnyTime
                    ? error ? <p className="error-message">{error}</p> : null
                    : touched && error ? <p className="error-message">{error}</p> : null
                }
            </div>
        );
    }
}

class CustomDatePickerInput extends React.Component {

    render () {
        return (
            <button
                type="button"
                className="date-picker-button-view-custom"
                onClick={this.props.onClick}>
                {this.props.value || this.props.placeholder}
            </button>
        );
    }
}

CustomDatePickerInput.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string
};

export const RenderPhoneNumberField = ({input, className, customFormat, labelMessage = null, key, defaultCountry, meta: {touched, error}}) => {
    return (
        <div className="phoneNumberWrapper">
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <TelephoneInput {...input} touched={touched} key={key} customFormat={customFormat}
                            defaultCountry={defaultCountry} className={className} error={error}/>
        </div>
    );
};

export const RenderDatePickerField = ({input, className, placeholder, labelMessage = null, key, min = 0, max = 999999, meta: {touched, error}}) => {
    let now = new Date();

    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <DatePicker
                customInput={<CustomDatePickerInput />}
                showYearDropdown
                showMonthDropdown
                selected={input.value && moment(input.value) || null}
                placeholderText={t(placeholder)}
                openToDate={moment(new Date(new Date(now.getFullYear() - min, now.getMonth(), now.getDate()).getTime()))}
                maxDate={moment(new Date(new Date(now.getFullYear() - min, now.getMonth(), now.getDate()).getTime()))}
                minDate={moment(new Date(new Date(now.getFullYear() - max, now.getMonth(), now.getDate()).getTime()))}
                dateFormat="DD/MM/YYYY"
                dropdownMode="select"
                popoverAttachment="bottom left"
                popoverTargetAttachment="top left"
                popoverTargetOffset="0px 0px"
                onChange={input.onChange}
                disabledKeyboardNavigation
            />
            {touched && error && <p className="error-message">{error}</p>}
        </div>
    );
};

export const RenderSelectField = ({input, className, labelMessage = null, key, options, selected, meta: {touched, error}}) => {
    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <div className="select-contain-m">
                <select {...input} selected={selected}>
                    {
                        options.map((option, index) => (
                            <option key={index}
                                    value={option.value || option.translationKey || ''}>{t(option.translationKey || option.text)}</option>
                        ))
                    }
                </select>
                {touched && error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export const RenderMonthField = ({input, className, labelMessage = null, key, selected, meta: {touched, error}}) => {
    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <div className="select-contain-m">
                <select {...input} selected={selected}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((option, index) => (
                            <option key={index}
                                    value={option}>{option}</option>
                        ))
                    }
                </select>
                {touched && error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export const RenderYearField = ({input, className, labelMessage = null, key, selected, meta: {touched, error}}) => {
    let currentYear = new Date().getFullYear(), max = 10, length = currentYear + max, options = [];

    for (; currentYear <= length; currentYear++) {
        options.push(currentYear.toString());
    }
    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <div className="select-contain-m">
                <select {...input} selected={selected}>
                    {
                        options.map((option, index) => (
                            <option key={index}
                                    value={option}>{option}</option>
                        ))
                    }
                </select>
                {touched && error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export const RenderAvailableCurrenciesField = ({input, className, labelMessage = null, key, meta: {touched, error}}) => {
    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <div className="select-contain-m">
                <AvailableCurrencies selected={input.value} onChange={input.onChange}/>
            </div>
            {touched && error && <p className="error-message">{error}</p>}
        </div>
    );
};

export const RenderCountryCodeField = ({input, className, labelMessage = null, key, changeHandler, registrationForm, meta: {touched, error}}) => {
    let filtredCountries = countries.list,
        restrictedCountries = Config.main.regConfig.settings.restrictedCountries,
        notRestrictedCountries = Config.main.regConfig && Config.main.regConfig.settings && Config.main.regConfig.settings.notRestrictedCountries;

    restrictedCountries && restrictedCountries.length && (filtredCountries = countries.list.filter((country) => {
        return restrictedCountries.indexOf(country.iso) === -1;
    }));

    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <div className="select-contain-m">
                <select defaultValue={input.value} onChange={ (evt) => {
                    input.onChange(evt);
                    changeHandler(evt);
                } }>
                    {
                        filtredCountries.sort(Helpers.orderByName).map((country) => {
                            return (
                                <option key={country.iso} value={country.iso}>{t(country.name)}</option>
                            );
                        })
                    }
                </select>
                {touched && error && <p className="error-message">{error}</p>}
            </div>
            {notRestrictedCountries && registrationForm && registrationForm.values && registrationForm.values.country_code && notRestrictedCountries.indexOf(registrationForm.values.country_code) === -1 && <p className="info-message" dangerouslySetInnerHTML={{__html: t("restircted_countries_info")}} />}
        </div>
    );
};

export const RenderCaptchaField = ({input, placeholder, className, key, imageSrc, captchaLoaded, resetCaptchaHandler, meta: {touched, error}}) => {
    return (
        <div className={className} key={key}>
            <input {...input} placeholder={placeholder} type="text"/>
            {touched && error && <p className="error-message">{error}</p>}
            <div className="img-wrapper-m">
                {captchaLoaded ? <img src={imageSrc}/> : <HorizontalLoader/>}
            </div>
            <button className="reset-b-captcha" onClick={resetCaptchaHandler} type="button">Reset</button>
        </div>
    );
};

export const Recaptcha = ({input, placeholder, className, key, captchaLoaded, resetCaptchaHandler, siteKey, meta: {touched, error}}) => {
    return (
        <div className={className} key={key}>
            {touched && error && <p className="error-message">{error}</p>}

            <div className="img-wrapper-m">
                {captchaLoaded
                    ? <ReCAPTCHA
                        sitekey={siteKey}
                        onChange={input.onChange}
                    />
                    : <HorizontalLoader/>}
            </div>
        </div>
    );
};

export const RenderAgreeField = ({input, placeholder, className, key, cmsData, language, meta: {touched, error}}) => {
    let termsPage = getPageBySLug(cmsData && cmsData.page, TERMS_AND_CONDITIONS_SLUG);
    return (
        <div className={className} key={key}>
            <div className="icon-status-view">
                {Config.main.regConfig.fields.agree && !Config.main.regConfig.fields.agree.showAsLink && termsPage
                    ? <div className="accept-information-view">
                        <Expandable className="info-title-contain-m">
                            <p>{termsPage.title}</p>
                        </Expandable>
                        <div className="mini-info-wrapper-accept-r">
                            <div className="registration-terms-popup"
                                 dangerouslySetInnerHTML={{__html: termsPage.content}}/>
                        </div>
                    </div> : null}
                <label className="checkbox-wrapper-m">
                    <input {...input} type="checkbox" checked={input.value}/>
                    {Config.main.regConfig.fields.agree && Config.main.regConfig.fields.agree.showAsLink && termsPage
                        ? <span><a key={termsPage.slug}
                                   href={`/page/help-root-${language}/${encodeURIComponent(termsPage.title)}`}
                                   target={"_blank"}>
                            {placeholder}
                      </a></span>
                        : <span>{placeholder}</span>}
                </label>
                {touched && error && <p className="error-message">{error}</p>}

            </div>
        </div>
    );
};

export const RenderTimeField = ({input, placeholder, className, key, showErrorsAnyTime, type, labelMessage, meta: {touched, error, pristine}}) => {
    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            {
                <input {...input} placeholder={placeholder} type={type}/>
            }
            {showErrorsAnyTime
                ? error ? <p className="error-message">{t(error)}</p> : null
                : touched && error ? <p className="error-message">{t(error)}</p> : null
            }
        </div>
    );
};

RenderAgreeField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    cmsData: PropTypes.object,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    key: PropTypes.string,
    language: PropTypes.string
};

RenderInputField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    hashParams: PropTypes.object,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    showErrorsAnyTime: PropTypes.bool,
    key: PropTypes.string,
    type: PropTypes.string
};

RenderPasswordField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    showErrorsAnyTime: PropTypes.bool,
    key: PropTypes.string,
    type: PropTypes.string
};

RenderPhoneNumberField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    defaultCountry: PropTypes.string,
    customFormat: PropTypes.object,
    key: PropTypes.string
};

RenderDatePickerField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    labelMessage: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    key: PropTypes.string
};

RenderSelectField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    selected: PropTypes.string,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    options: PropTypes.array,
    key: PropTypes.string
};

RenderMonthField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    selected: PropTypes.string,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    options: PropTypes.array,
    key: PropTypes.string
};

RenderYearField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    selected: PropTypes.string,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    options: PropTypes.array,
    key: PropTypes.string
};

RenderCountryCodeField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    changeHandler: PropTypes.func,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    key: PropTypes.string,
    registrationForm: PropTypes.object
};

RenderAvailableCurrenciesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    key: PropTypes.string
};

RenderCaptchaField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    captchaLoaded: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    imageSrc: PropTypes.string,
    resetCaptchaHandler: PropTypes.func,
    key: PropTypes.string
};

Recaptcha.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    captchaLoaded: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    imageSrc: PropTypes.string,
    resetCaptchaHandler: PropTypes.func,
    key: PropTypes.string,
    siteKey: PropTypes.string
};

RenderTimeField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    // hashParams: PropTypes.object,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    labelMessage: PropTypes.string,
    showErrorsAnyTime: PropTypes.bool,
    key: PropTypes.string,
    type: PropTypes.string
};