import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Validate from "../../../helpers/validate";
import formsNames from '../../../constants/formsNames';
import {SetDepositNextStep, SetMethodExternalFormData, SetMethodIframeData, SetMethodConfirmAction, DoPaymentRequest} from '../../../actions/payments';
import {OpenPopup} from "../../../actions/ui";
import {t} from '../../../helpers/translator';
import PaymentsFormMixin from '../../../mixins/paymentsFormMixin';
import {PaymentsMixin} from '../../../mixins/paymentsMixin';
import {GetPaymentsData} from "../../../helpers/selectors";
import PropTypes from 'prop-types';
import moment from "moment";

const validate = (values, state) => {
    const errors = {},
        balance = state.user && state.user.profile && state.user.profile.balance ? (state.user.profile.balance - state.user.profile.frozen_balance || 0) : 0;

    !state.payments.method.nextStep && state.payments.method.withdrawFormFields.forEach((field) => {
        let customCurrencyCode = state.payments && state.payments.method && state.payments.method.customCurrency && state.payments.method.customCurrency.trim(),
            allRatesCurrencies = state.ratesCurrencies,
            rate = customCurrencyCode && allRatesCurrencies[customCurrencyCode] && allRatesCurrencies[customCurrencyCode].rate,
            realAmount = values && values.amount,
            exchangedAmount = customCurrencyCode && (realAmount * rate).toFixed(allRatesCurrencies[customCurrencyCode].rounding || 2),
            uniqueCustomCurrency = customCurrencyCode && customCurrencyCode !== state.user.profile.currency_name;

        if (field.type === "number" && field.name === "amount") {
            let minWithdraw = state.payments.method.info[state.user.profile.currency_name].minWithdraw,
                maxWithdraw = state.payments.method.info[state.user.profile.currency_name].maxWithdraw;

            if (minWithdraw && !uniqueCustomCurrency) {
                Validate(values.amount, "amount", ["minWithdraw", minWithdraw], errors);
            }

            if (maxWithdraw && !uniqueCustomCurrency) {
                Validate(values.amount, "amount", ["maxWithdraw", maxWithdraw], errors);
            }

            !(state.payments.method && state.payments.method.customCurrency) && Validate(values.amount, "amount", ["maxWithdraw", balance], errors, t("Insufficient balance."));

            !(state.payments.method && state.payments.method.customCurrency) && Validate(values.amount, "amount", ["required", true], errors);
        }
        if (field.type === "email") {
            Validate(values[field.name], field.name, [field.type], errors);
        }
        if (field.type === "text" && field.required) {
            Validate(values[field.name], field.name, ["required", true], errors);
        }

        if (customCurrencyCode && uniqueCustomCurrency && exchangedAmount > state.user.profile.balance) {
            Validate(values.amount, "amount", ["maxWithdraw", balance], errors, t("The amount is higher than your current balance"));
        }
        if (customCurrencyCode && uniqueCustomCurrency && realAmount < state.payments.method.info[customCurrencyCode].minWithdraw) { //TODO check part with payments
            Validate(values.amount, "amount", ["minWithdraw", balance], errors, t("Amount is less than minimum allowed"));
        }
    });
    return errors;
};

const WithdrawForm = React.createClass({

    propTypes: {
        payments: PropTypes.object,
        uiState: PropTypes.object,
        routeParams: PropTypes.object,
        checkUserAuthentication: PropTypes.func,
        selectMethod: PropTypes.func
    },

    contextTypes: {
        router: PropTypes.object.isRequired
    },

    componentWillMount () {
        window.scrollTo(0, 0);
    },

    componentWillReceiveProps (nextProps) {
        if (this.props.payments.method && this.props.payments.method.name !== nextProps.routeParams.method) {
            this.props.selectMethod(nextProps.routeParams.method, nextProps.payments.availableMethods, this.props.dispatch, this.context.router, this.props.payments.data);
        }
        this.props.checkUserAuthentication(this.context.router);
        if (nextProps.submitSucceeded && nextProps.payments.nextStep) {
            this.props.enableNextStep();
        }
    },

    render () {
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

function firstElement (list) {
    if (!list || (list && list.constructor !== Object && list.constructor !== Array)) {
        return null;
    }
    if (list.constructor === Array) {
        return list[0];
    } else if (list.constructor === Object && Object.keys(list).length) {
        return list[Object.keys(list)[0]];
    }
}

const mapStateToProps = (state, ownParams) => {
    let payments = GetPaymentsData(state),
        initialValues;

    if (state.form[formsNames.withdrawForm] && !state.form[formsNames.withdrawForm].initial && !state.payments.nextStep) {
        initialValues = ((payments.method || {}).withdrawFormFields || []).reduce((collected, current) => {
            switch (current.type) {
                case "select":
                    collected[current.name] = current.options && current.options[0] ? current.options[0].value || "" : "";
                    break;
                case "amount":
                    collected[current.name] = current.defaultValue || 0;
                    break;
                case "number":
                    collected[current.name] = current.defaultValue || 0;
                    break;
                case "month":
                    collected[current.name] = 1;
                    break;
                case "year":
                    collected[current.name] = new Date().getFullYear();
                    break;
                case "dateMask":
                    collected[current.name] = moment().format("YYYY-MM-DD");
                    break;
                default:
                    collected[current.name] = current.defaultValue || "";
                    break;
            }
            return collected;
        }, {});
    } else if (state.form[formsNames.withdrawForm] && state.form[formsNames.withdrawForm].initial && state.payments.nextStep && state.payments.nextStep.fields) {
        initialValues = initialValues || {};
        state.payments.nextStep.fields.constructor === Array && state.payments.nextStep.fields.forEach((field) => {
            initialValues[field.name] = field.value && field.value.type !== "select" ? field.value.setValue || field.setValue || "" : field.value.options && firstElement(field.value.options) && firstElement(field.value.options).value || 0;
        });
    }
    return {
        user: state.user,
        uiState: state.uiState,
        initialValues,
        forms: state.form,
        ownParams: ownParams,
        payments,
        language: state.preferences.lang,
        ratesCurrencies: state.swarmConfigData.currency
    };
};

export default connect(mapStateToProps)(PaymentsMixin({
    Component: PaymentsFormMixin({
        Component: (reduxForm({
            form: formsNames.withdrawForm,
            validate
        }))(WithdrawForm),
        submit: function (values) {
            let paymentId = this.props.payments.method.paymentID,
                serviceName = this.props.payments.method.name,
                request = this.toBackendObject(this.props, values, paymentId, serviceName),
                selectedMethod = this.props.payments.method;

            request.payee.forProduct = this.props.uiState.lastRouteType || 'sport';

            return this.processRequest(request, selectedMethod);

        },
        processRequest: function (request, selectedMethod) {
            let self = this;

            return DoPaymentRequest(request, "withdraw")(self.props.dispatch).then(
                (data) => {
                    if (data && data.result !== undefined && data.result === 0 && (!data.details || !data.details.error || data.details.error === 0)) {
                        //on success
                        let confirmData,
                            title,
                            message,
                            confirmedCallback;
                        if (data.details.method) {
                            switch (data.details.method.toLowerCase()) {
                                case 'post': //tested
                                case 'get': // tested
                                    confirmData = Object.assign({}, {
                                        formId: "confirmWithdrawForm_" + new Date().getTime()
                                    }, data.details);
                                    self.props.dispatch(SetMethodExternalFormData(confirmData));
                                    self.props.dispatch(OpenPopup("ConfirmWithdraw"));
                                    break;
                                case 'iframe': // tested
                                    self.props.dispatch(SetMethodIframeData({src: data.details.action}));
                                    break;
                                case 'confirmation': //tested on mock
                                    title = t("Info");
                                    message = t(selectedMethod.depositConfirmationText || `Tax deduction: ${self.getFieldValue(data.details.fields, 'fee') + ' ' + self.getFieldValue(data.details.fields, 'currency')} Do you want to continue?`);
                                    confirmedCallback = function () {
                                        self.processRequest(request, selectedMethod);
                                    };
                                    self.props.dispatch(SetMethodConfirmAction({
                                        title,
                                        request: request,
                                        confirmedCallback,
                                        message
                                    }));
                                    self.props.dispatch(OpenPopup("ConfirmWithdraw"));
                                    break;
                                case 'form': // partial (no any info about response)
                                    //self.props.dispatch(SetDepositNextStep(data.details));
                                    break;
                                case 'formdraw': // partial (no any info about response)
                                    self.props.dispatch(SetDepositNextStep(data.details));
                                    break;
                            }
                        } else {
                            self.props.dispatch(OpenPopup("message", {
                                title: t("Success"),
                                type: "accept",
                                body: t("Your withdraw has been successfully completed")
                            }));
                        }
                    } else {
                        if ((data.result && data.details && data.details.code) || data.code) {
                            self.handleSubmissionErrors(data.details || data);
                        }
                    }
                }
            );
        },
        init: function () {
            if (this.props.routeParams.method && this.props.payments.availableMethods.length) {
                this.selectMethod(this.props.routeParams.method, this.props.payments.availableMethods, this.props.dispatch, this.context.router, this.props.payments.data, this.props.ratesCurrencies);
            }
            this.checkUserAuthentication(this.context.router);
        }
    })
}));