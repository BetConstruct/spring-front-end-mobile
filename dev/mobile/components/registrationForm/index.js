import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Config from "../../../config/main";
import Validate from "../../../helpers/validate";
import formsNames from '../../../constants/formsNames';
import {RegistrationMixin} from '../../../mixins/registrationMixin';
import {ClosePopup, OpenPopup} from "../../../actions/ui";
import {CmsLoadPage} from "../../../actions/cms";
import * as countryData from "country-telephone-data";
import {changePhoneCode, changeCurrencyCode} from "../../../actions/reduxForm";
import {t} from "../../../helpers/translator";
import PropTypes from 'prop-types';
import countries from "../../../constants/countries";
import Helpers from "../../../helpers/helperFunctions";

let regConfig = Config.main.regConfig,
    registrationConfigs = regConfig.fields;

const allCountryCodes = [];
countryData.allCountries.forEach((item) => {
    allCountryCodes.push(item.dialCode);
});

/**
 * @name validate
 * @description check register fields validations from config
 * @param {Object} values
 * @returns {Object}
 */
const validate = (values) => {
    const errors = {};
    for (let prop in registrationConfigs) {
        let config = registrationConfigs[prop];
        if (config.customAttrs && !config.customAttrs.required && !values[config.name] && typeof values[config.name] === 'string' && values[config.name].length === 0) {
            continue;
        }
        if (config.hasOwnProperty("customAttrs")) {
            for (let validationField in registrationConfigs[prop].customAttrs) {
                if ((!values[config.name] && values[config.name] !== 0 && validationField === "required") || values[config.name]) {
                    Validate(values[config.name] && (typeof values[config.name] === "string" ? values[config.name].trim() : values[config.name]), config.name, [validationField, config.customAttrs[validationField]], errors, t(config.validationMessages[validationField]));
                }
            }
            if (prop === "phone_code") {
                Validate(values[config.name].replace("+", ""), config.name, ["contain", allCountryCodes], errors, t(config.validationMessages.contain));
            }
            if (prop === "phone" && !errors.phone_code && values.phone_code) {
                let lookup = allCountryCodes.indexOf(values.phone_code.replace("+", "")),
                    countryInfo = lookup !== -1 ? countryData.allCountries[lookup] : null,
                    customFormat = config.customFormat && config.customFormat.iso2 && config.customFormat.format && countryInfo && countryInfo.iso2 === config.customFormat.iso2 ? config.customFormat.format
                    : countryInfo && config.customFormat && Array.isArray(config.customFormat) && config.customFormat.find((val) => val.iso2 === countryInfo.iso2) !== undefined ? config.customFormat.find((val) => val.iso2 === countryInfo.iso2).format : null,
                    pattern = Array.isArray(customFormat)
                        ? (() => {
                            let generated = [];
                            customFormat.map((item) => {
                                let pattern = countryInfo && ("\\" + (item || countryInfo.format).replace(/-/g, "").replace(/\./g, '[0-9]') + "$").replace(/(\()/g, "").replace(/(\))/g, "").replace(/\s/g, '');
                                pattern && generated.push(pattern);
                            });
                            return generated;
                        })()
                        : countryInfo && ("\\" + (customFormat || countryInfo.format).replace(/-/g, "").replace(/\./g, '[0-9]') + "$").replace(/(\()/g, "").replace(/(\))/g, "").replace(/\s/g, '');

                if (countryInfo && pattern && Array.isArray(pattern)) {
                    Validate(values.phone_code + values[config.name].replace("+", ""), config.name, ["regexArray", pattern], errors, t(config.validationMessages.regex));
                } else if (countryInfo && pattern) {
                    Validate(values.phone_code + values[config.name].replace("+", ""), config.name, ["regex", pattern], errors, t(config.validationMessages.regex));
                }
            }
        }
        if (config.hasOwnProperty("specifications")) {
            for (let i = 0, length = config.specifications.length; i < length; i++) {
                let specification = config.specifications[i];
                switch (true) {
                    case specification.matchToPassword :
                    case specification.matchToEmail :
                        if (!specification.compareWith) {
                            continue;
                        }
                        Validate(values[config.name], config.name, [specification.validationKey, values[specification.compareWith]], errors, t(config.validationMessages[specification.validationKey]));
                }
            }
        }
    }
    return errors;
};

/**
 * @name isConfigEnabled
 * @description check configs properties
 * @param {Object} key
 * @returns {Object}
 */
const isConfigEnabled = key => {
    for (let prop in registrationConfigs) {
        if (registrationConfigs[prop].name === key) {
            return true;
        }
    }
};

class RegistrationForm extends React.Component {
    constructor (params) {
        super(params);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }
    handleLoginClick () {
        this.props.dispatch(ClosePopup(null));
        this.props.dispatch(OpenPopup("LoginForm"));
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.uiState.popup === "RegistrationForm" && nextProps.user.loggedIn) { //eslint-disable-line react/prop-types
            this.props.dispatch(ClosePopup(null)); //eslint-disable-line react/prop-types
        }
    }
    componentWillMount () {
        this.props.dispatch(CmsLoadPage("help-root-" + this.props.lang, this.props.lang));  //eslint-disable-line react/prop-types
    }
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
}

RegistrationForm.PropTypes = {
    fields: PropTypes.object.isRequired
};

/**
 * @name getRelatedInitialValues
 * @description get initial values from config
 * @param {Object} state
 * @param {Object} params
 * @returns {Object}
 */
const getRelatedInitialValues = (state, params) => {
    let availableLanguages = Config.main.availableLanguages,
        userFieldData = params.data,
        language,
        init;

    language = countries.iso2ToIso3[((availableLanguages[Config.env.lang] && availableLanguages[Config.env.lang]['short']) || "")].toLowerCase();
    init = {
        site_id: Config.main.site_id,
        language: language || "eng",
        lang_code: userFieldData.lang_code || (availableLanguages[language] && availableLanguages[language]['short']) || (Config.main.mapLanguages && Config.main.mapLanguages[language]) || "EN"
    };

    (isConfigEnabled("promo_code") || state.persistentUIState.hashParams.btag) && (init.promo_code = userFieldData.promo_code || state.persistentUIState.hashParams.btag || '');
    isConfigEnabled("birth_date") && (init.birth_date = userFieldData.birth_date || null);
    isConfigEnabled("gender") && (init.gender = userFieldData.gender || "M");
    isConfigEnabled("country_code") && (init.country_code = userFieldData.country_code || (regConfig && regConfig.settings && regConfig.settings.defaultCountry) || ((state.preferences.geoData && state.preferences.geoData.countryCode) || "").toUpperCase());
    isConfigEnabled("currency_name") && (init.currency_name = userFieldData.currency_name || Config.main.availableCurrencies ? Config.main.availableCurrencies[0] : '');
    isConfigEnabled("swift_code") && (init.swift_code = userFieldData.bank || (regConfig.fields && regConfig.fields.bank && regConfig.fields.bank.options && regConfig.fields.bank.options[0].value));
    isConfigEnabled("agree") && (init.agree = userFieldData.agree || false);
    isConfigEnabled("username") && (init.username = userFieldData.username || '');
    isConfigEnabled("address") && (init.address = userFieldData.address || '');
    isConfigEnabled("security_answer") && (init.security_answer = userFieldData.security_answer || '');
    isConfigEnabled("city") && (state.preferences.geoData && state.preferences.geoData.cityName) && (init.city = userFieldData.cityName || state.preferences.geoData.cityName);
    isConfigEnabled("security_question") && (init.security_question = userFieldData.security_question || registrationConfigs.securityQuestion.options[0].translationKey);
    isConfigEnabled("max_bet_amount") && registrationConfigs.max_bet_amount && (init.max_bet_amount = userFieldData.max_bet_amount || registrationConfigs.max_bet_amount.defaultValue || null);
    isConfigEnabled("max_daily_bet_amount") && registrationConfigs.max_daily_bet_amount && (init.max_daily_bet_amount = userFieldData.max_daily_bet_amount || registrationConfigs.max_daily_bet_amount.defaultValue || null);
    isConfigEnabled("casino_maximal_daily_bet") && registrationConfigs.casino_maximal_daily_bet && (init.casino_maximal_daily_bet = userFieldData.casino_maximal_daily_bet || registrationConfigs.casino_maximal_daily_bet.defaultValue || null);

    isConfigEnabled("email") && userFieldData.email && (init.email = userFieldData.email);
    isConfigEnabled("password") && userFieldData.password && (init.password = userFieldData.password);
    isConfigEnabled("first_name") && userFieldData.first_name && (init.first_name = userFieldData.first_name);
    isConfigEnabled("re_captcha") && userFieldData.re_captcha && (init.re_captcha = userFieldData.re_captcha);
    isConfigEnabled("captcha") && userFieldData.captcha && (init.captcha = userFieldData.captcha);
    isConfigEnabled("last_name") && userFieldData.last_name && (init.last_name = userFieldData.last_name);
    isConfigEnabled("doc_number") && userFieldData.doc_number && (init.doc_number = userFieldData.doc_number);

    //isConfigEnabled("phone") && (init.phone = {fullNumber: "", code: ""});
    if (isConfigEnabled("phone")) {
        let countryCode = regConfig && regConfig.settings && regConfig.settings.defaultCountry && regConfig.settings.defaultCountry.toLowerCase() ||
                (state.preferences.geoData && state.preferences.geoData.countryCode && state.preferences.geoData.countryCode.toLowerCase()),
            clientCountry = countryCode ? countryData.iso2Lookup[countryCode] ? countryData.allCountries[countryData.iso2Lookup[countryCode]] : null : null,
            dialCode = clientCountry && clientCountry.dialCode && `+${clientCountry.dialCode}`;

        init.phone = userFieldData.phone || "";
        init.phone_code = userFieldData.phone_code || dialCode || "+";
    }

    if (!userFieldData.currency_name && regConfig && regConfig.settings && regConfig.settings.connectCountryToCurrency && regConfig.settings.connectCountryToCurrency.enabled && init.country_code) {
        let relativeCurrencies = regConfig.settings.connectCountryToCurrency.map,
            defaultCurrency = regConfig.settings.connectCountryToCurrency.default,
            relativeCurrency = relativeCurrencies[init.country_code],
            availableCurrencies = Config.main.availableCurrencies;

        if (availableCurrencies.indexOf(relativeCurrency) !== -1 || availableCurrencies.indexOf(defaultCurrency) !== -1) {
            if (relativeCurrency) {
                init.currency_name = relativeCurrency;
            } else if (defaultCurrency) {
                init.currency_name = defaultCurrency;
            }
        }
    }

    return init;
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        initialValues: getRelatedInitialValues(state, state.registration),
        fieldsFromConfig: regConfig.fields,
        uiState: state.uiState,
        forms: state.form,
        lang: state.preferences.lang,
        preferences: state.preferences,
        cmsData: state.cmsData.data["help-root-" + state.preferences.lang]
    };
};

const EnhancedForm = reduxForm({
    form: formsNames.registrationForm,
    enableReinitialize: true,
    validate
})(RegistrationForm);

export default connect(mapStateToProps)(RegistrationMixin({
    Component: EnhancedForm,
    handleCountryCodeChange: function (evt) {
        let target = evt.currentTarget,
            currentSelectedCountry = target &&
                target.selectedOptions &&
                target.selectedOptions[0] &&
                target.selectedOptions[0].value &&
                countryData.allCountries[countryData.iso2Lookup[target.selectedOptions[0].value.toLowerCase()]] ||
                {},
            pattern;

        if (currentSelectedCountry.format) {
            pattern = ("." + currentSelectedCountry.format.replace(/\./g, '[0-9]') + "$").replace(/(\()/g, "\\(").replace(/(\))/g, "\\)");
        }

        if (Helpers.CheckIfPathExists(Config, "main.regConfig.settings.connectCountryToCurrency.enabled") && currentSelectedCountry) {
            let relativeCurrencies = regConfig.settings.connectCountryToCurrency.map,
                defaultCurrency = regConfig.settings.connectCountryToCurrency.default,
                relativeCurrency = relativeCurrencies[target.value],
                availableCurrencies = Config.main.availableCurrencies;

            if (availableCurrencies.indexOf(relativeCurrency) !== -1 || availableCurrencies.indexOf(defaultCurrency) !== -1) {
                if (relativeCurrency) {
                    this.props.dispatch(changeCurrencyCode(relativeCurrency, formsNames.registrationForm, "currency_name"));
                } else if (defaultCurrency) {
                    this.props.dispatch(changeCurrencyCode(defaultCurrency, formsNames.registrationForm, "currency_name"));
                }
            }
        }

        if (currentSelectedCountry.dialCode) {
            this.props.dispatch(changePhoneCode(`+${currentSelectedCountry.dialCode}`, formsNames.registrationForm, "phone_code", pattern));
        }

    }
}));

