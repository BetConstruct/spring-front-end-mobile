import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Validate from "../../../helpers/validate";
import formsNames from '../../../constants/formsNames';
import {
    DoPaymentRequest,
    SetMethodExternalFormData,
    SetMethodIframeData,
    SetMethodConfirmAction,
    SetDepositNextStep
} from '../../../actions/payments';
import {OpenPopup, ClosePopup} from "../../../actions/ui";
import {updateUserProfile} from "../../../actions/user";
import {t} from "../../../helpers/translator";
import PaymentsFormMixin from "../../../mixins/paymentsFormMixin";
import {PaymentsMixin} from "../../../mixins/paymentsMixin";
import {GetPaymentsData} from "../../../helpers/selectors";
import Config from "../../../config/main";
import Zergling from '../../../helpers/zergling';
import PropTypes from 'prop-types';
import moment from "moment";

/**
 * @name validate
 * @description helper function for deposit fields validations
 * @param values
 * @param {object} state
 * @returns {object}
 * */
const validate = (values, state) => {
    const errors = {};

    if (!state.payments.method) {
        errors.amount = "This field is required";
        return errors;
    }

    //state.payments.method.info[state.user.profile.currency_name]

    !state.payments.method.nextStep &&
    state.payments.method.depositFormFields && state.payments.method.depositFormFields.forEach((field) => {
        if (field.type === "number" && field.name === "amount") {
            let minDeposit = state.payments.method.info[state.user.profile.currency_name].minDeposit,
                maxDeposit = state.payments.method.info[state.user.profile.currency_name].maxDeposit;

            if (minDeposit) {
                Validate(values.amount, "amount", ["minDeposit", minDeposit], errors);
            }

            if (maxDeposit) {
                Validate(values.amount, "amount", ["maxDeposit", maxDeposit], errors);
            }
            Validate(values.amount, "amount", ["required", true], errors);
        }

        if (field.type === "email") {
            Validate(values[field.name], field.name, [field.type], errors);
        }

        if (field.type === "text" && field.required) {
            Validate(values[field.name], field.name, ["required", true], errors);
        }

    });

    return errors;
};

const DepositForm = React.createClass({

    propTypes: {
        payments: PropTypes.object,
        routeParams: PropTypes.object,
        checkUserAuthentication: PropTypes.func,
        selectMethod: PropTypes.func,
        uiState: PropTypes.object
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
        if (!this.props.payments.method) {
            return (null);
        }
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

    if (state.form[formsNames.depositForm] && !state.form[formsNames.depositForm].initial && !state.payments.nextStep) {
        initialValues = ((payments.method || {}).depositFormFields || []).reduce((collected, current) => {

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
                case "email":
                    collected[current.name] = "";
                    break;
                default:
                    collected[current.name] = current.defaultValue || "";
                    break;
            }
            return collected;
        }, {});
    } else if (state.form[formsNames.depositForm] && state.form[formsNames.depositForm].initial && state.payments.nextStep && state.payments.nextStep.fields) {
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
        ratesCurrencies: state.swarmConfigData.currency || null
    };
};

export default connect(mapStateToProps)(PaymentsMixin({
    Component: PaymentsFormMixin({
        Component: (reduxForm({form: formsNames.depositForm, validate})(DepositForm)),
        submit: function (values) {
            let profile = this.props.user.profile,
                self = this;
            if (profile.active_step === 21 && profile.active_step_state === 5 && Config.main.checkActiveStepsForFirstDeposit) {
                const acceptCondition = () => {
                    Zergling.get({}, 'accept_terms_conditions').then(function (response) {
                        if (response.result === 0) {
                            self.props.dispatch(updateUserProfile({active_step: null, active_step_state: null}));
                            self.props.dispatch(ClosePopup());
                        } else {
                            console.error('accept_terms_conditions ERROR');
                        }
                    }, function () {
                        console.error('accept_terms_conditions ERROR');
                    });
                };
                this.props.dispatch(OpenPopup("accept_or_cancel", {
                    type: "info",
                    title: t("Confirmation"),
                    body: t("We hold customers funds separately from the business accounts, and arrangements have been made to ensure that assets in the customer accounts are distributed to customers in the event of insolvency. For more information, please refer to our Terms and Conditions. This meets with the UK Gambling Commission’s requirements for the segregation of customer funds at the level: medium protection. Further information can be found here."),
                    accept_button: 'I agree',
                    cancel_button: 'I do not agree',
                    accept_button_function: acceptCondition
                }));
            } else {
                let paymentId = this.props.payments.method.paymentID,
                    request = this.toBackendObject(this.props, values, paymentId, this.props.payments.method.name),
                    selectedMethod = this.props.payments.method;
                request.payer.forProduct = this.props.uiState.lastRouteType || 'sport';
                return this.processRequest(request, selectedMethod);
            }
        },
        processRequest: function (request, selectedMethod) {
            let self = this;
            return DoPaymentRequest(request, "deposit")(this.props.dispatch).then(
                (data) => {
                    if (data && data.result !== undefined && data.result === 0 && (!data.details || !data.details.error || data.details.error === 0)) {
                        //on success
                        let confirmData,
                            title,
                            message,
                            confirmedCallback;

                        if (data.details.method && data.details.method !== 'message') {
                            switch (data.details.method.toLowerCase()) {
                                case 'post': //tested
                                case 'get': //tested
                                    confirmData = Object.assign({}, {
                                        formId: "confirmDepositForm_" + new Date().getTime()
                                    }, data.details);
                                    this.props.dispatch(SetMethodExternalFormData(confirmData));
                                    this.props.dispatch(OpenPopup("ConfirmDeposit"));
                                    break;
                                case 'iframe': //tested
                                    this.props.dispatch(SetMethodIframeData({src: data.details.action}));
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
                                    self.props.dispatch(OpenPopup("ConfirmDeposit"));
                                    break;
                                case 'form': // partial (no any info about response)
                                    this.props.dispatch(SetDepositNextStep(data.details));
                                    break;
                                case 'formdraw': // partial (no any info about response)
                                    self.props.dispatch(SetDepositNextStep(data.details));
                                    break;
                            }
                        } else {
                            self.props.dispatch(OpenPopup("message", {
                                title: t("Success"),
                                type: "accept",
                                body: t(data.details.method === 'message' && typeof data.details.message === 'string' ? data.details.message : "Your deposit has been successfully completed")
                            }));
                        }
                    } else {
                        if ((data.hasOwnProperty("result") && data.details && (data.details.code || data.details.message || data.details.error)) || data.code) {
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