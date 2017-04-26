import React from 'react';
import {SubmissionError, Field} from 'redux-form';
import {RenderInputField, RenderSelectField, RenderPhoneNumberField, RenderDatePickerField} from "../components/registrationFields";
import {t} from '../helpers/translator';
import {getErrorMessageByCode} from '../constants/errorCodes';
import {SelectPaymentMethod, LoadBetShops, SelectDefaultAmount, DeselectPaymentMethod} from '../actions/payments';
import {UIOpen, OpenPopup} from "../actions/ui";
import {updateQueryStringParameter} from "../helpers/updateQueryStringParameter";
import formsNames from '../constants/formsNames';
import Loader from "../mobile/components/loader";
import Config from "../config/main";
import moment from 'moment';

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
    class PaymentsFormMixin extends React.Component {
        constructor (props) {
            super(props);
            this.getLimits = this.getLimits.bind(this);
            this.getFormItem = this.getFormItem.bind(this);
            this.handleSubmissionErrors = this.handleSubmissionErrors.bind(this);
            this.getMethodFromConfig = this.getMethodFromConfig.bind(this);
            this.selectMethod = this.selectMethod.bind(this);
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
        selectMethod (methodName, availableMethods, dispatcher, router, paymentData) {

            let method = this.getMethodFromConfig(methodName, availableMethods);
            if (method) {
                dispatcher && dispatcher(SelectPaymentMethod(Object.assign({}, method)));
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
         * @returns {React.Element}
         */
        getFormItem (field, key, isBetShopField) {

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
                case "select":
                    return (
                        <Field
                            name={field.name}
                            component={RenderSelectField}
                            key={key}
                            className="form-p-i-m"
                            options={field.options}
                            selected={field.options[0]}
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
                            key={key}
                            min={Config.main.regConfig.settings.minYearOld}
                            max={Config.main.regConfig.settings.maxYearOld}
                            type="text"
                            className="single-form-item date-picker-wrapper"
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
        toBackendObject (props, values) {
            let amount = +values.amount,
                formFields = this.isForWithdraw() ? props.payments.method.withdrawFormFields : props.payments.method.depositFormFields,
                length = formFields.length,
                i = 0;

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
            delete values.amount;
            if (this.isForWithdraw()) {
                return Object.assign({}, {payee: values}, {service: props.payments.method.name}, {amount: amount});
            }
            return Object.assign({}, {payer: values}, {service: props.payments.method.name}, {amount: amount});
        }

        /**
         * @name toBackendObject
         * @description Helper function to check user authentication and redirect
         * @fire event:uiOpen
         * @fire event:openPopup
         */
        checkUserAuthontication (router) {
            let user = this.user || this.props.user,
                dispatch = this.dispatch || this.props.dispatch;

            if (!user.loginInProgress && !user.loggedIn) {
                dispatch(UIOpen("rightMenu"));
                dispatch(OpenPopup("LoginForm"));
                router.push("/");
            }
        }

        render () {
            if (!this.props.payments.method) {
                this.initMethod();
                return <Loader />;
            }
            return <ComposedComponent.Component
                {...this.props}
                {...this.state}
                getFormItem={this.getFormItem}
                getLimits={this.getLimits}
                handleSubmissionErrors={this.handleSubmissionErrors}
                submitHandler={this.submitHandler}
                selectMethod={this.selectMethod}
                getMethodFromConfig={this.getMethodFromConfig}
                checkUserAuthontication={this.checkUserAuthontication}
                handleDefaultAmountClick={this.handleDefaultAmountClick}
                toBackendObject={this.toBackendObject}
            />;
        }
    }
    PaymentsFormMixin.contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    return PaymentsFormMixin;
};

PaymentsFormMixin.PropTypes = {
    payments: React.PropTypes.object.isRequired
};
export default PaymentsFormMixin;
