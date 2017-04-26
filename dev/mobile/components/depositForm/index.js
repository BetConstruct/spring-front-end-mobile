import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Validate from "../../../helpers/validate";
import formsNames from '../../../constants/formsNames';
import {DoPaymentRequest, SetMethodExternalFormData, SetMethodIframeData, SetMethodConfirmAction, SetDepositNextStep} from '../../../actions/payments';
import {OpenPopup} from "../../../actions/ui";
import {t} from "../../../helpers/translator";
import PaymentsFormMixin from "../../../mixins/paymentsFormMixin";
import {PaymentsMixin} from "../../../mixins/paymentsMixin";
import {GetPaymentsData} from "../../../helpers/selectors";

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
        payments: React.PropTypes.object,
        routeParams: React.PropTypes.object,
        checkUserAuthontication: React.PropTypes.func,
        selectMethod: React.PropTypes.func,
        uiState: React.PropTypes.object
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    componentWillMount () {
        window.scrollTo(0, 0);
    },

    componentWillReceiveProps (nextProps) {
        if (this.props.payments.method && this.props.payments.method.name !== nextProps.routeParams.method) {
            this.props.selectMethod(nextProps.routeParams.method, nextProps.payments.availableMethods, this.props.dispatch, this.context.router, this.props.payments.data);
        }
        this.props.checkUserAuthontication(this.context.router);
    },

    render () {
        if (!this.props.payments.method) {
            return (null);
        }
        return Template.apply(this); //eslint-disable-line no-undef
    }
});

const mapStateToProps = (state, ownParams) => {
    let payments = GetPaymentsData(state),
        initialValues = ((payments.method || {}).depositFormFields || []).reduce((collected, current) => {
            if (current.type === 'select') {
                collected[current.name] = current.options && current.options[0] ? current.options[0].value || "" : "";
            } else if (current.name !== "amount") {
                collected[current.name] = current.defaultValue || "";
            } else if (current.type === "dateMask") {
                collected[current.name] = "1900-01-01";
            }
            return collected;
        }, {});
    initialValues.amount = 0;
    return {
        user: state.user,
        uiState: state.uiState,
        initialValues,
        forms: state.form,
        ownParams: ownParams,
        payments
    };
};

export default connect(mapStateToProps)(PaymentsMixin({
    Component: PaymentsFormMixin({
        Component: (reduxForm({ form: formsNames.depositForm, validate })(DepositForm)),
        submit: function (values) {
            let request = this.toBackendObject(this.props, values),
                selectedMethod = this.props.payments.method;

            request.payer.forProduct = this.props.uiState.lastRouteType || 'sport';
            return this.processRequest(request, selectedMethod);
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
                this.selectMethod(this.props.routeParams.method, this.props.payments.availableMethods, this.props.dispatch, this.context.router, this.props.payments.data);
            }
            this.checkUserAuthontication(this.context.router);
        }
    })
}));