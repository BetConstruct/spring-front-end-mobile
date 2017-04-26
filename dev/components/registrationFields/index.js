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

export const RenderInputField = ({ input, placeholder, className, key, type, meta: { touched, error, pristine } }) => {
    if (type === "radio") {
        return (
            <div className={className} key={key}>
                <label>
                    <input {...input} type="radio" />
                    <span>{placeholder}</span>
                </label>
                {touched && error && <p className="error-message">{error}</p>}
            </div>
        );
    }
    return (
        <div className={className} key={key}>
            <input {...input} placeholder={placeholder} type={type} />
            {touched && error && <p className="error-message">{error}</p>}
        </div>
    );
};

export const RenderPhoneNumberField = ({ input, className, labelMessage = null, key, defaultCountry, meta: { touched, error } }) => {
    return (
        <div className="phoneNumberWrapper">
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <TelephoneInput {...input} touched={touched} key={key} defaultCountry={defaultCountry} className={className} error={error}/>
        </div>
    );
};

export const RenderDatePickerField = ({ input, className, labelMessage = null, key, min = 0, max = 999999, meta: { touched, error } }) => {
    let now = new Date();

    return (
        <div className={className} key={key}>
            {labelMessage
                ? (<label className="description-label-w-m">{labelMessage}</label>)
                : (null)
            }
            <DatePicker
                showYearDropdown
                showMonthDropdown
                selected={moment(input.value || new Date(new Date(now.getFullYear() - min, now.getMonth(), now.getDate()).getTime()))}
                maxDate={moment(new Date(new Date(now.getFullYear() - min, now.getMonth(), now.getDate()).getTime()))}
                minDate={moment(new Date(new Date(now.getFullYear() - max, now.getMonth(), now.getDate()).getTime()))}
                dateFormat="YYYY-MM-DD"
                dropdownMode="select"
                onChange={input.onChange}
                disabledKeyboardNavigation
            />
            {touched && error && <p className="error-message">{error}</p>}
        </div>
    );
};

export const RenderSelectField = ({ input, className, labelMessage = null, key, options, selected, meta: { touched, error } }) => {
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

export const RenderAvailableCurrenciesField = ({ input, className, labelMessage = null, key, meta: { touched, error } }) => {
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

export const RenderCountryCodeField = ({ input, className, labelMessage = null, key, changeHandler, meta: { touched, error } }) => {
    let filtredCountries = countries.list,
        restrictedCountries = Config.main.regConfig.settings.restrictedCountries;

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
                        filtredCountries.map((country) => {
                            return (
                                <option key={country.iso} value={country.iso}>{t(country.name)}</option>
                            );
                        })
                    }
                </select>
                {touched && error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export const RenderCaptchaField = ({ input, placeholder, className, key, imageSrc, captchaLoaded, resetCaptchaHandler, meta: { touched, error } }) => {
    return (
        <div className={className} key={key}>
            <input {...input} placeholder={placeholder} type="text"/>
            {touched && error && <p className="error-message">{error}</p>}
            <div className="img-wrapper-m">
                {captchaLoaded ? <img src={imageSrc} /> : <HorizontalLoader/>}
            </div>
            <button className="reset-b-captcha" onClick={resetCaptchaHandler} type="button">Reset</button>
        </div>
    );
};

export const RenderAgreeField = ({ input, placeholder, className, key, cmsData, meta: { touched, error } }) => {
    let termsPage = getPageBySLug(cmsData && cmsData.page, TERMS_AND_CONDITIONS_SLUG);
    return (
        <div className={className} key={key}>
            <div className="icon-status-view">
                {termsPage ? <div className="accept-information-view">
                        <Expandable className="info-title-contain-m">
                            <p>{termsPage.title}</p>
                        </Expandable>
                        <div className="mini-info-wrapper-accept-r">
                            <div className="registration-terms-popup" dangerouslySetInnerHTML={{__html: termsPage.content}}/>
                        </div>
                    </div> : null}
                <label className="checkbox-wrapper-m">
                    <input {...input} type="checkbox"/>
                    <span>{placeholder}</span>
                </label>
                {touched && error && <p className="error-message">{error}</p>}

            </div>
        </div>
    );
};

RenderAgreeField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    cmsData: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    key: React.PropTypes.string
};

RenderInputField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    labelMessage: React.PropTypes.string,
    key: React.PropTypes.string,
    type: React.PropTypes.string
};

RenderPhoneNumberField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    className: React.PropTypes.string,
    labelMessage: React.PropTypes.string,
    defaultCountry: React.PropTypes.string,
    key: React.PropTypes.string
};

RenderDatePickerField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    className: React.PropTypes.string,
    labelMessage: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    key: React.PropTypes.string
};

RenderSelectField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    selected: React.PropTypes.string,
    className: React.PropTypes.string,
    labelMessage: React.PropTypes.string,
    options: React.PropTypes.array,
    key: React.PropTypes.string
};

RenderCountryCodeField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    changeHandler: React.PropTypes.func,
    className: React.PropTypes.string,
    labelMessage: React.PropTypes.string,
    key: React.PropTypes.string
};

RenderAvailableCurrenciesField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    className: React.PropTypes.string,
    labelMessage: React.PropTypes.string,
    key: React.PropTypes.string
};

RenderCaptchaField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    captchaLoaded: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    imageSrc: React.PropTypes.string,
    resetCaptchaHandler: React.PropTypes.func,
    key: React.PropTypes.string
};