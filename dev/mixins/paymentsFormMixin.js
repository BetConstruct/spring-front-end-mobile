import React from 'react';
import {SubmissionError, Field} from 'redux-form';
import {RenderInputField, RenderSelectField, RenderPhoneNumberField, RenderDatePickerField, RenderMonthField, RenderYearField, RenderTimeField} from "../components/registrationFields";
import {t} from '../helpers/translator';
import {getErrorMessageByCode} from '../constants/errorCodes';
import {
    SelectPaymentMethod, LoadBetShops, SelectDefaultAmount, DeselectPaymentMethod,
    UnsetDepositNextStep
} from '../actions/payments';
import {UIOpen, OpenPopup} from "../actions/ui";
import {updateQueryStringParameter} from "../helpers/updateQueryStringParameter";
import formsNames from '../constants/formsNames';
import Loader from "../mobile/components/loader";
import Config from "../config/main";
import moment from 'moment';
import PropTypes from 'prop-types';
import {LoadCurrencyConfig} from "../actions/initialData";
import Helpers from "../helpers/helperFunctions";

/**
 * @name amountNormalizer
 * @description Helper function for validation
 * @param {number|string} value
 * @returns {number|string}
 */
const amountNormalizer = (value) => {
    if (value && ("" + value).length > 1 && ("" + value).match(/^0/) && ("" + value).indexOf(".") !== 1) {
        value = value.split("");
        value = value[1];
    }
    return value;
};

/**
 * @name PaymentsFormMixin
 * @description PaymentsFormMixin is a HOC(Higher Order Component) which adds additional properties and methods to wrapped component
 * @param {React.Component} ComposedComponent
 * @constructor
 */

const PaymentsFormMixin = ComposedComponent => {
    class PaymentsFormWrapper extends React.Component {
        constructor (props) {
            super(props);
            this.getLimits = this.getLimits.bind(this);
            this.getFormItem = this.getFormItem.bind(this);
            this.handleSubmissionErrors = this.handleSubmissionErrors.bind(this);
            this.getMethodFromConfig = this.getMethodFromConfig.bind(this);
            this.selectMethod = this.selectMethod.bind(this);
            this.enableNextStep = this.enableNextStep.bind(this);
            this.handleDefaultAmountClick = this.handleDefaultAmountClick.bind(this);

            if (ComposedComponent.submit) {
                this.submitHandler = ComposedComponent.submit.bind(this);
            }

            if (ComposedComponent.processRequest) {
                this.processRequest = ComposedComponent.processRequest.bind(this);
            }
            if (ComposedComponent.init) {
                this.initMethod = ComposedComponent.init.bind(this);
            }
        }

        componentWillUnmount () {
            this.props.dispatch(DeselectPaymentMethod());
            this.props.dispatch(UnsetDepositNextStep());
        }

        /**
         * @name getMethodFromConfig
         * @description Helper function to find a selected method from source
         * @param {string} methodName
         * @param {Array} availableList
         * @returns {object}
         */
        getMethodFromConfig (methodName, availableList) {
            return availableList.filter((method) => {
                return method.name === methodName;
            })[0];
        }

        /**
         * @name selectMethod
         * @description Helper function to check method and load specifications if needed
         * @param {string} methodName
         * @param {Array} availableMethods
         * @param {function} dispatcher
         * @param {object} router
         * @param {object} paymentData
         * @fire event:selectPaymentMethod
         * @fire event:loadBetShops
         */
        selectMethod (methodName, availableMethods, dispatcher, router, paymentData, ratesCurrencies) {
            let method = this.getMethodFromConfig(methodName, availableMethods);
            if (method && ratesCurrencies && method.customCurrency && !ratesCurrencies[method.customCurrency]) {
                dispatcher(LoadCurrencyConfig(method.customCurrency));
            }
            if (method) {
                dispatcher && dispatcher(SelectPaymentMethod(Helpers.cloneDeep(method)));
                if (dispatcher && method.hasBetShops && !(paymentData.loaded || paymentData.loading || paymentData.failed)) {
                    dispatcher(LoadBetShops());
                }
            } else {
                router && router.push("/balance/withdraw");
            }
        }

        /**
         * @name handleSubmissionErrors
         * @description Helper function to get a user friendly error message
         * @param {object} response
         * @throws SubmissionError
         */
        handleSubmissionErrors (response) {
            if (response.method === "message" && typeof response.error === 'string') {
                throw new SubmissionError({_error: t(response.error)});
            } else if (response.method === "message" && typeof response.message === 'string') {
                throw new SubmissionError({_error: t(response.message)});
            } else if (response.error && typeof response.error === 'string') {
                throw new SubmissionError({_error: t(response.error)});
            } else if (response.code !== undefined || typeof response.error === 'string') {
                throw new SubmissionError({_error: getErrorMessageByCode(response.code || response.error, true, response.error)});
            } else {
                throw new SubmissionError({_error: getErrorMessageByCode(9999999)});
            }
        }

        /**
         * @name getFormItem
         * @description Helper function to generate form fields dynamically
         * @param {object} field
         * @param {string|number} key
         * @param {boolean} isBetShopField
         * @param {boolean} hasCustomCurrency
         * @returns {React.Element}
         */
        getFormItem (field, key, isBetShopField, hasCustomCurrency) {

            if (isBetShopField) {
                return (
                    <Field
                        name="office_id"
                        component={RenderInputField}
                        key={key}
                        value={"" + field.id}
                        placeholder={field.address}
                        type="radio"
                        className="radio-form-item"
                    />
                );
            }

            switch (field.type) {
                case "number" :
                    return (
                        <Field
                            name={field.name}
                            component={RenderInputField}
                            key={key}
                            showErrorsAnyTime={hasCustomCurrency}
                            type={field.type}
                            className="single-form-item"
                            normalize={amountNormalizer}
                        />
                    );
                case "email":
                case "password":
                case "text":
                    return (
                        <Field
                            name={field.name}
                            component={RenderInputField}
                            key={key}
                            type={field.type}
                            className="single-form-item"
                        />
                    );
                case "hidden":
                    return (
                        <Field
                            name={field.name}
                            component={RenderInputField}
                            key={key}
                            type={field.type}
                            className="single-form-item"
                        />
                    );
                case "select":
                    return (
                        <Field
                            name={field.name}
                            component={RenderSelectField}
                            key={key}
                            className="form-p-i-m"
                            options={field.options.constructor === Array ? field.options : Helpers.objectToArray(field.options)}
                            selected={field.options[0]}
                        />
                    );
                case "month":
                    return (
                        <Field
                            name={field.name}
                            component={RenderMonthField}
                            key={key}
                            className="form-p-i-m"
                            selected={1}
                        />
                    );
                case "year":
                    return (
                        <Field
                            name={field.name}
                            component={RenderYearField}
                            key={key}
                            className="form-p-i-m"
                            selected={new Date().getFullYear()}
                        />
                    );
                case "phone":
                    return (
                        <Field
                            name={field.name}
                            component={RenderPhoneNumberField}
                            key={key}
                            className="single-form-item"
                        />
                    );
                case "dateMask":
                    return (
                        <Field
                            name={field.name}
                            component={RenderDatePickerField}
                            placeholder="Day/Month/Year"
                            key={key}
                            min={Config.main.regConfig.settings.minYearOld}
                            max={Config.main.regConfig.settings.maxYearOld}
                            type="text"
                            className="single-form-item date-picker-wrapper"
                        />
                    );
                case "time":
                    return (
                        <Field
                            name={field.name}
                            component={RenderTimeField}
                            key={key}
                            type={field.type}
                            className="single-form-item"
                        />
                    );
            }
        }

        /**
         * @name getLimits
         * @description Helper function to get min max limits
         * @param {number} min
         * @param {number} max
         * @param {string} currency
         * @returns {string | null}
         */
        getLimits (min, max, currency) {
            switch (true) {
                case min && max:
                    return t(`Limits: ${currency} ${min} - ${max}`);
                case min && !max:
                    return t(`Limits: min - ${min} ${currency}`);
                case !min && max:
                    return t(`Limits: max - ${max} ${currency}`);
                default:
                    return (null);
            }
        }

        /**
         * @name getFieldValue
         * @description Helper function to get predefined value for field
         * @param {Array} fields
         * @param {string} name
         * @returns {*}
         */
        getFieldValue (fields, name) {
            let i;
            for (i = 0; i < fields.length; i++) {
                if (fields[i].name === name) {
                    return fields[i].value || '';
                }
            }
            return '';
        }

        /**
         * @name isForWithdraw
         * @description Helper function to get transaction type
         * @returns {boolean}
         */
        isForWithdraw () {
            return this.props.location.pathname.search('/balance/withdraw') === 0;
        }

        /**
         * @name isForWithdraw
         * @description Event listener
         * @fire event:selectDefaultAmount
         */
        handleDefaultAmountClick (value) {
            let self = this;
            this.props.dispatch(SelectDefaultAmount(
                value,
                {
                    form: self.isForWithdraw() ? formsNames.withdrawForm : formsNames.depositForm,
                    field: "amount",
                    touched: false,
                    persistentSubmitErrors: false
                }
            ));
        }

        /**
         * @name toBackendObject
         * @description Helper function to prepare data for request
         * @returns {object}
         */
        toBackendObject (props, values, paymentID, serviceName) {
            this.amount = this.amount || values.amount;
            if (paymentID === 87) {
                values = {
                    ...values,
                    type: 0,
                    command: 'CreatePaymentMessage',
                    eamount: values.amount
                };
                delete values.amount;
                delete values.forProduct;
                return Object.assign({}, {payer: values}, {service: serviceName || paymentID}, {amount: 100});
            } else {
                let amount = (!this.isForWithdraw() && props.payments.method.depositPrefilledAmount) || (+values.amount),
                    formFields = this.isForWithdraw() ? props.payments.method.withdrawFormFields : props.payments.method.depositFormFields,
                    length = formFields.length,
                    i = 0;

                delete values.amount;
                values = {
                    ...values,
                    status_urls: {
                        success: updateQueryStringParameter(window.location.toString(), "status", "ok"),
                        cancel: updateQueryStringParameter(window.location.toString(), "status", "cancel"),
                        fail: updateQueryStringParameter(window.location.toString(), "status", "fail")
                    }
                };
                for (; i < length; i++) {
                    let field = formFields[i];
                    if (field.type === "dateMask") {
                        values[field.name] = moment(values[field.name]).format(Config.main.regConfig.settings.dateFormat || "DD/MM/YYYY");
                        break;
                    }
                }

                if (this.isForWithdraw()) {
                    let customCurrencyFromConfig = props.payments && props.payments.method && props.payments.method.customCurrency && props.payments.method.customCurrency.trim(),
                        realCurrency = props.user.profile.currency_name;
                    if (customCurrencyFromConfig && customCurrencyFromConfig !== realCurrency) {
                        let allRatesCurrencies = props.ratesCurrencies,
                            rate = allRatesCurrencies[customCurrencyFromConfig] && allRatesCurrencies[customCurrencyFromConfig].rate && (+allRatesCurrencies[customCurrencyFromConfig].rate),
                            exchangedAmount = amount * rate;
                        values.custom_amount = exchangedAmount;
                    }
                    return Object.assign({}, {payee: values}, {service: serviceName}, {amount: amount || +this.amount});
                }
                return Object.assign({}, {payer: values}, {service: serviceName || paymentID}, {amount: amount || +this.amount});
            }
        }

        /**
         * @name checkUserAuthentication
         * @description Helper function to check user authentication and redirect
         * @fire event:uiOpen
         * @fire event:openPopup
         */
        checkUserAuthentication (router) {
            let user = this.user || this.props.user,
                dispatch = this.dispatch || this.props.dispatch;

            if (!user.loginInProgress && !user.loggedIn) {
                dispatch(UIOpen("rightMenu"));
                dispatch(OpenPopup("LoginForm"));
                router.push("/");
            }
        }

        enableNextStep () {
            this.nextStepUID = Date.now();
            this.forceUpdate();
        }

        render () {
            if (!this.props.payments.method) {
                this.initMethod();
                return <Loader />;
            }
            return <ComposedComponent.Component
                {...this.props}
                {...this.state}
                key={this.nextStepUID || "formWrapper"}
                getFormItem={this.getFormItem}
                getLimits={this.getLimits}
                handleSubmissionErrors={this.handleSubmissionErrors}
                submitHandler={this.submitHandler}
                enableNextStep={this.enableNextStep}
                selectMethod={this.selectMethod}
                getMethodFromConfig={this.getMethodFromConfig}
                checkUserAuthentication={this.checkUserAuthentication}
                handleDefaultAmountClick={this.handleDefaultAmountClick}
                toBackendObject={this.toBackendObject}
            />;
        }
    }
    PaymentsFormWrapper.contextTypes = {
        router: PropTypes.object.isRequired
    };
    PaymentsFormWrapper.propTypes = {
        payments: PropTypes.object,
        location: PropTypes.object,
        user: PropTypes.object
    };
    return PaymentsFormWrapper;
};

export default PaymentsFormMixin;
