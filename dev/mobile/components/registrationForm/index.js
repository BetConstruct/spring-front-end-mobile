import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Config from "../../../config/main";
import Validate from "../../../helpers/validate";
import moment from 'moment';
import formsNames from '../../../constants/formsNames';
import {RegistrationMixin} from '../../../mixins/registrationMixin';
import {ClosePopup} from "../../../actions/ui";
import {CmsLoadPage} from "../../../actions/cms";
import * as countryData from "country-telephone-data";
import {changePhoneCode} from "../../../actions/reduxForm";
import {t} from "../../../helpers/translator";

let registrationConfigs = Config.main.regConfig.fields;

/**
 * @name validate
 * @description check register fields validations from config
 * @param {Object} values
 * @returns {Object}
 */
const validate = values => {
    const errors = {};
    for (var prop in registrationConfigs) {
        let config = registrationConfigs[prop];

        if (config.hasOwnProperty("customAttrs")) {
            for (let validationField in registrationConfigs[prop].customAttrs) {
                if (prop === "phone") {
                    Validate(values[config.name].fullNumber, config.name, [validationField, config.customAttrs[validationField]], errors, t(config.validationMessages[validationField]));
                } else {
                    if (validationField === "required" && config.customAttrs[validationField]) {
                        Validate(values[config.name], config.name, [validationField, config.customAttrs[validationField]], errors, t(config.validationMessages[validationField]));
                    } else if (validationField !== "required") {
                        Validate(values[config.name], config.name, [validationField, config.customAttrs[validationField]], errors, t(config.validationMessages[validationField]));
                    }
                }
            }
            if (prop === "phone" && values.phone.pattern) {
                Validate(values.phone.fullNumber, config.name, ["regex", values.phone.pattern], errors, t(config.validationMessages["regex"]));
            }
        }
        if (config.hasOwnProperty("specifications")) {

            for (let i = 0, length = config.specifications.length; i < length; i++) {
                let specification = config.specifications[i];

                switch (true) {
                    case specification.matchToPassword :
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

const RegistrationForm = React.createClass({

    PropTypes: {
        fields: React.PropTypes.object.isRequired
    },
    componentWillReceiveProps (nextProps) {
        if (this.props.uiState.popup === "RegistrationForm" && nextProps.user.loggedIn) { //eslint-disable-line react/prop-types
            this.props.dispatch(ClosePopup()); //eslint-disable-line react/prop-types
        }
    },
    componentWillMount () {
        this.props.dispatch(CmsLoadPage("help-root-" + this.props.lang, this.props.lang));  //eslint-disable-line react/prop-types
    },
    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

/*
 * we need to have some predefined values vor each filed to bind related initial value and not hard coded values
 * */

/**
 * @name getRelatedInitialValues
 * @description get initial values from config
 * @param {Object} state
 * @returns {Object}
 */
const getRelatedInitialValues = (state) => {
    let now = new Date(),
        init = {
            site_id: Config.main.site_id,
            language: Config.env.lang,
            lang_code: Config.main.availableLanguages[Config.env.lang]['short']
        };
    //TODO discus with guys from where we can get initial values

    isConfigEnabled("promo_code") && state.user.hashParams.btag && (init.promo_code = state.user.hashParams.btag);
    isConfigEnabled("birth_date") && (init.birth_date = moment(new Date(new Date(now.getFullYear() - Config.main.regConfig.settings.minYearOld, now.getMonth(), now.getDate()).getTime())));
    isConfigEnabled("gender") && (init.gender = "M");
    isConfigEnabled("country_code") && (init.country_code = Config.main.regConfig.settings.defaultCountry);
    isConfigEnabled("currency_name") && (init.currency_name = Config.main.availableCurrencies ? Config.main.availableCurrencies[0] : '');
    isConfigEnabled("agree") && (init.agree = false);
    isConfigEnabled("security_question") && (init.security_question = registrationConfigs.securityQuestion.options[0].translationKey);
    isConfigEnabled("phone") && (init.phone = {fullNumber: "", code: ""});

    return init;
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        initialValues: getRelatedInitialValues(state),
        fieldsFromConfig: Config.main.regConfig.fields,
        uiState: state.uiState,
        forms: state.form,
        lang: state.preferences.lang,
        cmsData: state.cmsData.data["help-root-" + state.preferences.lang]
    };
};

export default connect(mapStateToProps)(reduxForm({
    form: formsNames.registrationForm,
    enableReinitialize: true,
    validate
})(RegistrationMixin({
    Component: RegistrationForm,
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
            pattern = "." + currentSelectedCountry.format.replace(/\./g, '[0-9]') + "$";
        }

        if (currentSelectedCountry.dialCode) {
            this.props.dispatch(changePhoneCode(currentSelectedCountry.dialCode, formsNames.registrationForm, undefined, pattern));
        }

    }
})));

